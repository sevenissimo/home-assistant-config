/^[^#]/ {
  s/:.*//
  h
  s/.*/echo &|md5sum/e
  s/ .*//
  x
  G
  s/\n/: "/
  s/$/"/
}
