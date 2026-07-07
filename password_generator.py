import random
import string

lowercase_chars = string.ascii_lowercase
uppercase_chars = string.ascii_uppercase
numbers = string.digits
spl_chars = '!@#$%&(){}|'
chars = lowercase_chars + uppercase_chars + numbers + spl_chars

password = []
password.append(random.choice(uppercase_chars))
password.append(random.choice(lowercase_chars))
password.append(random.choice(numbers))
password.append(random.choice(spl_chars))

length = int(input("Enter length of password: "))

if length >= 8:
    for i in range(length-4):
        password.append(random.choice(chars))
    
    random.shuffle(password)
    password = ''.join(password)
    print("Here's your password: ",password)

else:
    print ("Length of password should be more than 8!")