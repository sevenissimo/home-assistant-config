PREFIX := /var/lib
CONFDIR := $(PREFIX)/hass

OWNER := hass
GROUP := hass

RSYNC := rsync --exclude-from='.rsyncignore' --chown=$(OWNER):$(GROUP) --chmod=D775,F664
PROTECTED := automations.yaml scenes.yaml scripts.yaml

git-setup:
	git config --local include.path ../.gitfilters

show-diff:
	$(RSYNC) -rin ./ $(DESTDIR)$(CONFDIR) | grep '^>f' | awk '{print $$2}' | xargs -I{} diff -u "$(DESTDIR)$(CONFDIR)/{}" "{}" || true

dry-run:
	$(RSYNC) -rin ./ $(DESTDIR)$(CONFDIR)

install:
	$(RSYNC) -rv $(foreach file,$(PROTECTED),--exclude='$(file)') ./ $(DESTDIR)$(CONFDIR)
	$(RSYNC) -v --ignore-existing $(PROTECTED) $(DESTDIR)$(CONFDIR)

.PHONY: install dry-run show-diff git-setup
