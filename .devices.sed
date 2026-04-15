/^#/d
/^[^ ]/ {
# s/.*/uuidgen/e
  s/.*/echo &|md5sum/e
  s/[ -]//g
  h
  s/$/:/
}
/name:/ {
  g
  s/^/  name: /
}
/mac:/ {
  g
  s/.//11g
  s/../&:/g
  s/:$//
  s/^/  mac: /
}
