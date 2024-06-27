PREFIX := /var/lib
CONFDIR := $(PREFIX)/hass

OWNER := hass
GROUP := hass

dry-run:
	rsync --dry-run -auv --exclude-from='.rsyncignore' ./* $(DESTDIR)$(CONFDIR)

install:
	rsync -auv --exclude-from='.rsyncignore' --chown=$(OWNER):$(GROUP) ./* $(DESTDIR)$(CONFDIR)


.PHONY:
