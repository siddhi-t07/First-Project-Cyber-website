import re  # re = regular expressions module. it lets us search patterns in text.
def check_password_strength(password):  # defined a function called check_password_strength, where password = user input.
    if len(password)<8:
        return "Weak Password: Password must be at least 8 characters long."  # return stops the function and sends back the message.
    
    if not re.search(r"\d", password):  #\d = any digit (0-9), re.search() looks for that pattern in 'password'.
        return "Weak Password: Password must include a number."
    
    if not re.search(r"[A-Z]", password):  # checking for uppercase character.
        return "Weak Password: Password must include an uppercase character."
    
    if not re.search(r"[a-z]", password):  # checking for lowercase character.
        return "Weak Password: Password must include a lowercase character."
    
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):  # checking for special characters.
        return "Weak Password: Password must include a special character."
    
    return "Strong Password: Your password is secure!"  #if none of the checks fail, the password is strong.

password = input("Enter a password to check its strength: ")  #takes user input.

print(check_password_strength(password))  #runs the function to print result.