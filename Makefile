PREFIX := /var/lib
CONFDIR := $(PREFIX)/hass

OWNER := hass
GROUP := hass

dry-run:
	rsync --dry-run -auv --exclude-from='.rsyncignore' ./* $(DESTDIR)$(CONFDIR)

setup-git:
	git config --local include.path ../.gitfilters

install:
	rsync -auv --exclude-from='.rsyncignore' --chown=$(OWNER):$(GROUP) ./* $(DESTDIR)$(CONFDIR)

.PHONY: install dry-run
