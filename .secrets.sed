/^[^#]/ {
  s/:.*//
  h
  s/.*/head -c56 \/dev\/random|base64/e
  x
  G
  s/\n/: "/
  s/$/"/
}
