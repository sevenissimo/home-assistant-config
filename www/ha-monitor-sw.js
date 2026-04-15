// Debug flag - set to false for production
const DEBUG_MODE = true
const PING_URL = self.location.origin + '/local/ping.txt'
const CHECK_INTERVAL = 15 * 60 * 1000  // 15 minutes
let isOffline = false
let consecutiveFailures = 0

self.addEventListener('install', () => {
    console.log('HA Monitor SW: Installed')
    self.skipWaiting()
})

self.addEventListener('activate', event => {
    console.log('HA Monitor SW: Activated') 
    event.waitUntil(self.clients.claim())
})

self.addEventListener('periodicsync', event => {
    console.log('HA Monitor SW: Periodic sync triggered')
    if (event.tag === 'ha-monitor') {
        event.waitUntil(checkHAServer())
    }
})

self.addEventListener('message', event => {
    console.log('HA Monitor SW: Message received:', event.data)
    if (event.data.type === 'START_MONITORING') {
        startMonitoring()
    } else if (event.data.type === 'PING_NOW') {
        checkHAServer()
    }
})

async function startMonitoring() {
    try {
        await self.registration.periodicSync.register('ha-monitor', {
            minInterval: CHECK_INTERVAL
        })
        
        console.log('HA Monitor SW: Periodic sync registered')
        
        // Immediate first check
        checkHAServer()
        
        // Send notification about monitoring start
        if (DEBUG_MODE) {
            showNotification('HA Monitor Started', 'Background monitoring active', 'info')
        }
        
    } catch (error) {
        console.error('HA Monitor SW: Failed to register periodic sync:', error)
        if (DEBUG_MODE) {
            showNotification('HA Monitor Error', `Failed to start: ${error.message}`, 'error')
        }
    }
}

async function checkClientConnectivity() {
    // Check 1: Navigator online status
    if (!navigator.onLine) {
        throw new Error('Client offline (navigator.onLine)')
    }
    
    // Check 2: Ping external reliable service
    try {
        const response = await fetch('https://dns.google/resolve?name=google.com&type=A', {
            method: 'GET',
            cache: 'no-cache',
            signal: AbortSignal.timeout(5000)  // 5 second timeout
        })
        
        if (!response.ok) {
            throw new Error(`External connectivity check failed: HTTP ${response.status}`)
        }
        
        return true
    } catch (error) {
        // Fallback: try simpler ping
        try {
            const fallbackResponse = await fetch('https://www.google.com/favicon.ico', {
                method: 'HEAD',
                cache: 'no-cache',
                signal: AbortSignal.timeout(3000)
            })
            
            if (fallbackResponse.ok) {
                return true
            }
            throw new Error('Fallback connectivity check failed')
        } catch (fallbackError) {
            throw new Error('No internet connectivity detected')
        }
    }
}

async function checkHAServer() {
    const timestamp = new Date().toLocaleTimeString()
    console.log(`HA Monitor SW: Starting check at ${timestamp}`)
    
    try {
        // Step 1: Check client connectivity first
        console.log('HA Monitor SW: Checking client connectivity...')
        await checkClientConnectivity()
        console.log('HA Monitor SW: Client connectivity OK')
        
        // Step 2: Check HA server
        console.log('HA Monitor SW: Pinging HA server...')
        const response = await fetch(PING_URL, {
            method: 'GET',
            cache: 'no-cache',
            signal: AbortSignal.timeout(10000)
        })
        
        if (response.ok) {
            // Server is online
            consecutiveFailures = 0
            
            if (isOffline) {
                isOffline = false
                const message = `HA Server back online at ${timestamp}`
                console.log(message)
                showNotification('HA Server Online', message, 'success')
            } else if (DEBUG_MODE) {
                showNotification('HA Ping OK', `HA responding at ${timestamp}`, 'info')
            }
            
        } else {
            throw new Error(`HA Server HTTP ${response.status}`)
        }
        
    } catch (error) {
        console.log(`HA Monitor SW: Check failed: ${error.message}`)
        
        // Determine if it's client or server issue
        let isClientIssue = false
        try {
            await checkClientConnectivity()
        } catch (connectivityError) {
            isClientIssue = true
            if (DEBUG_MODE) {
                showNotification('Client Offline', `No internet: ${connectivityError.message}`, 'warning')
            }
            console.log('HA Monitor SW: Client connectivity issue, skipping HA server failure count')
            return  // Don't count as HA server failure
        }
        
        // It's a server issue, not client
        if (!isClientIssue) {
            consecutiveFailures++
            
            if (DEBUG_MODE) {
                showNotification('HA Ping Failed', `Server attempt ${consecutiveFailures}: ${error.message}`, 'warning')
            }
            
            if (consecutiveFailures >= 2 && !isOffline) {
                isOffline = true
                showNotification('HA Server Offline', `Server unreachable since ${timestamp}`, 'error')
            }
        }
    }
}

function showNotification(title, body, type = 'info') {
    if (Notification.permission !== 'granted') return
    
    const options = {
        body: body,
        icon: '/static/icons/favicon-192x192.png',
        badge: '/static/icons/favicon-192x192.png',
        tag: `ha-monitor-${type}`,
        timestamp: Date.now(),
        requireInteraction: type === 'error',
        actions: type === 'error' ? [
            { action: 'retry', title: 'Retry Now' }
        ] : []
    }
    
    self.registration.showNotification(title, options)
}

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('HA Monitor SW: Notification clicked:', event.action)
    
    event.notification.close()
    
    if (event.action === 'retry') {
        checkHAServer()
    }
    
    // Focus or open HA window
    event.waitUntil(
        self.clients.matchAll().then(clients => {
            if (clients.length > 0) {
                return clients[0].focus()
            }
            return self.clients.openWindow('/')
        })
    )
})
