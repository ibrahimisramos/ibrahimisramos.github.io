#!/usr/bin/env ruby
# Usage: ruby scripts/hash-flag.rb 'CTF{my_flag}'
# Prints the SHA-256 to paste into a challenge's `flag_hash:`. The checker
# lowercases input, so the flag is lowercased here too.
require "digest"
abort "usage: ruby scripts/hash-flag.rb 'CTF{...}'" if ARGV.empty?
puts Digest::SHA256.hexdigest(ARGV.first.strip.downcase)
