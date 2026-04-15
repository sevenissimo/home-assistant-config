console.log('HA Monitor: Module loading...')

class HAMonitor {
    constructor() {
        console.log('HA Monitor: Constructor called')
        this.config = {
            target_url: window.location.origin,
            check_interval: 15,
            retry_count: 2
        }
        this.swRegistration = null
        this.init()
    }

    async init() {
        console.log('HA Monitor: Starting external monitoring...')
        
        // Request notification permission first
        await this.requestNotificationPermission()
        
        // Register SW
        await this.registerServiceWorker()
    }

    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission()
            console.log('HA Monitor: Notification permission:', permission)
            
            if (permission === 'granted') {
                // Test notification
                new Notification('HA Monitor Ready', {
                    body: 'Background monitoring will start shortly',
                    icon: '/static/icons/favicon-192x192.png'
                })
            }
        }
    }

    async registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.error('HA Monitor: Service Workers not supported')
            return
        }

        try {
            this.swRegistration = await navigator.serviceWorker.register('/local/ha-monitor-sw.js', {
                scope: '/local/ha-monitor/'
            })
            
            await navigator.serviceWorker.ready
            console.log('HA Monitor: Dedicated SW registered')

            if (!this.swRegistration.periodicSync) {
                console.error('HA Monitor: Periodic Background Sync not supported')
                return
            }

            navigator.serviceWorker.addEventListener('message', e => {
                if (e.data.source === 'ha-monitor') {
                    console.log('HA Monitor: SW message:', e.data)
                }
            })

            // Start monitoring
            this.startMonitoring()
            
            // Manual test ping after 5 seconds
            setTimeout(() => {
                console.log('HA Monitor: Sending manual ping test')
                this.swRegistration.active?.postMessage({type: 'PING_NOW'})
            }, 5000)
            
        } catch (error) {
            console.error('HA Monitor: SW registration failed:', error)
        }
    }

    startMonitoring() {
        if (this.swRegistration?.active) {
            console.log('HA Monitor: Starting background monitoring')
            this.swRegistration.active.postMessage({type: 'START_MONITORING'})
        }
    }
}

// Multiple start strategies
const startMonitor = () => {
    console.log('HA Monitor: Attempting to start...')
    try {
        new HAMonitor()
    } catch (e) {
        console.error('HA Monitor: Failed to start:', e)
    }
}

// Immediate start
startMonitor()

// DOM ready fallback
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startMonitor)
} else {
    setTimeout(startMonitor, 1000)
}
