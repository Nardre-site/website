
In this challenge we are reversing a Unity Game called "Flappy_bug".
![[CTF/unity IL2CPP - shutlock images/image1.png]]

---

Here is the important files:
-  global-metadata.dat: contains function / variables / class names
- ScriptingAssemblies.json: contains dll list
- flag.dat: encrypted flag
- flappy_bug.exe: the game
- GameAssembly.dll: the code source

![[CTF/unity IL2CPP - shutlock images/image2.png]]

---

By opening GameAssembly.dll on ghidra, all the functions names are missing.
Let's retrieve them using il2cppdumper.
![[CTF/unity IL2CPP - shutlock images/image3.png]]

--- 
Here is the [il2cppdumper git project](https://github.com/perfare/il2cppdumper)
Here is the [il2cppdumper online version](https://il2cppdumper.com/)
I used the online version.
![[CTF/unity IL2CPP - shutlock images/image4.png]]

---

Once the dumper script done, we have some usefull script for ghidra and ida. And some DummyDll.
![[CTF/unity IL2CPP - shutlock images/image7.png]]

---

By checking Assemlby-CSharp.dll on dnSpy, we can find an interesting class "flag_script".
We don't have the source code but we have the address.
![[CTF/unity IL2CPP - shutlock images/image14.png]]

---

Let's import ghidra script to retrieve the name functions.
![[CTF/unity IL2CPP - shutlock images/image5.png]]

---

If you have the error "Python is not available". Make sure you lunch pyghidraRun in ghidra/support directory.
![[CTF/unity IL2CPP - shutlock images/image6.png]]
![[CTF/unity IL2CPP - shutlock images/image8.png]]

---

Now ghidra use Jython or python3 and the script is a python2.7, so to fix this problem we will add at the top of our script.
```python
#@runtime Jython
```

![[CTF/unity IL2CPP - shutlock images/image9.png]]
![[CTF/unity IL2CPP - shutlock images/image11.png]]

---

By lunching the script and giving it the script.json. we retrive the name of the functions !
![[CTF/unity IL2CPP - shutlock images/image12.png]]
![[CTF/unity IL2CPP - shutlock images/image13.png]]

---

Let's analyse flag_script.start() as seen in dummy.dll .
The function start by getting `StreamingAssets` path and concatenate it with a string `flag.dat` and read his content.
It then get a key of length 4, unfortunately the function to retrieve the key is obscure.
then we xor the flag with the key.
Finally, the function load the image.
![[CTF/unity IL2CPP - shutlock images/image15.png]]

---

We are missing the key but we know his length: 4 and we know that the deciphered flag is an image.
But all image start with magic bytes.
Here is the magic bytes for png:
![[CTF/unity IL2CPP - shutlock images/image16.png]]
![[CTF/unity IL2CPP - shutlock images/image17.png]]
We retrieve the key with this simple script by XORing are flag ciphered by the expected png magic bytes.
```python
content = open("flag.dat", "rb").read()  
expected = bytes([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])  
for a, b in zipa(content, expected):  
   print(a ^ b)
```
the key is 
```python
[35, 122, 177, 79]
```

---

We xor back the flag:
```python
content = open("flag.dat", "rb").read()
key = bytes([35, 122, 177, 79])

png = [content[i] ^ key[i % 4] for i in range(len(content))]

with open("flag.png", "wb") as file:
    file.write(bytes(png))
```

![[CTF/unity IL2CPP - shutlock images/image18.png]]