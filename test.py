import ecdsa
import random
import hashlib

b58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

def privateKeyToWif(key_hex):    
    return base58CheckEncode(0x80, key_hex.decode('hex'))
    
def privateKeyToPublicKey(s):
    sk = ecdsa.SigningKey.from_string(s.decode('hex'), curve=ecdsa.SECP256k1)
    vk = sk.verifying_key
    return ('\04' + sk.verifying_key.to_string()).encode('hex')
    
def pubKeyToAddr(s):
    ripemd160 = hashlib.new('ripemd160')
    ripemd160.update(hashlib.sha256(s.decode('hex')).digest())
    return base58CheckEncode(0,ripemd160.digest())

def keyToAddr(s):
	return pubKeyToAddr(privateKeyToPublicKey(s))

def base58encode(n):
    result = ''
    while n > 0:
        result = b58[n%58] + result
        n /= 58
    return result

def base58CheckEncode(version, payload):
    s = chr(version) + payload
    checksum = hashlib.sha256(hashlib.sha256(s).digest()).digest()[0:4]
    result = s + checksum
    leadingZeros = countLeadingChars(result, '\0')
   
    return '1' * leadingZeros + base58encode(base256decode(result))

def base256decode(s):
    result = 0
    for c in s:
        result = result * 256 + ord(c)
    return result

def countLeadingChars(s, ch):
    count = 0
    for c in s:
        if c == ch:
            count += 1
        else:
            break
    return count


with open("brute-pvks.txt") as file:
    for private_key in file:
        private_key = private_key.strip(' \t\n\r')
        print private_key +","+ keyToAddr(private_key)
        print_format = private_key +","+ keyToAddr(private_key)
        f = open('privKeyandAdd.txt','a+')
        f.write("%s \r\n" % print_format)
        f.close()
        
        
        
   



