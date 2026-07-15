# EXTENSIF

The challenge sample is available on [Hacropole](https://hackropole.fr/en/challenges/reverse/fcsc2026-reverse-extensif/).
![[extensif_1.png]]

---

# Introduction
In this write-up, we will install the `esp32-flash-image-loader` extension in ghidra.
Since the target is an ESP32, we will solve this challenge statically.

![[extensif_0.jpg|300]]

---

# Basic static analysis

Running `file` and `strings` reveals that the binary is an ESP32 firmware containing useful text.
```bash
$ file extensif.bin
extensif.bin: ESP-IDF application image for ESP32, project name: "extensif", version 1, compiled on Mar 24 2026 15:29:16, IDF version: v5.5.1, entry address: 0x400811E8
```

```bash
$ strings extensif.bin | grep -i "FCSC"  
preuve avec FCSC{%s}
```

---
# Installing esp32 flash image loader

We will install an extension to import ESP32 flash images, as Ghidra cannot recognize the binary by default.
![[extensif_2.png]]

---

Install `gradle` and clone the repository [github.com/dynacylabs/ghidra-esp32-flash-loader.git](https://github.com/dynacylabs/ghidra-esp32-flash-loader.git)
```bash
git clone https://github.com/espressif/xtensa-isa-doc.git
cd ghidra-esp32-flash-loader
export GHIDRA_INSTALL_DIR=`YOUR_GHIDRA_PATH_HERE`
gradle
```

The ZIP extension is located in the `dist` folder. Move it to `ghidra/Extensions/Ghidra`.
Next, launch Ghidra, go to `File` -> `Install Extensions`, and enable it. If it does not appear, add it manually using the `+` button.
![[extensif_3.png]]

---

Ghidra should now recognize the format and language.

![[extensif_4.png]]

---
# Static analysis

Now for the classic method. We found the string "FCSC" during basic static analysis, so let's locate it in Ghidra.

![[extensif_5.png]]

![[extensif_6.png]]

---

We found the main algorithm.
It first initializes a flag to `"FCSCFCSCFCSCFCSC"`, then calls a function to modify it.
Finally, it XORs the modified flag with some data.
![[extensif_7.png]]

![[extensif_8.png]]

--- 

Here is the `modif_expected_flag` function and the trick of the challenge:
The function uses an uninitialized `a0` register, which Ghidra renamed to `unaff_retaddr`.
![[extensif_9.png]]
![[extensif_10.png]]

---

In Ghidra, the `unaff_` prefix indicates that the variable is unaffected, and `retaddr` means the register used holds the return address, which is `a0` in Xtensa architecture.
The return address is utilized when a `ret` instruction is called.

The image below can be found in [Ghidra: Fix unaff_ via Set Register Values... by 0x6d696368](https://youtu.be/aWIcd2BRItc)
The calling convention details are available in the [xtensa documentation pdf](https://github.com/espressif/xtensa-isa-doc).
![[extensif_11.png]]
![[extensif_12.png]]

---

The first `unaff_retaddr` is the address of the `modif_expected_flag` return instruction: `0x400d60ef`.
The other `unaff_retaddr` values are the address of the `algo_rec` return instruction: `0x400d6108`.
![[extensif_13.png]]
![[extensif_14.png]]

---

The rest of the main algorithm is just a simple `scanf` and `memcmp`.
![[extensif_15.png]]

---

Here is the full solve script:
```python
def modif_expected_flag(n, flag, ind, unaff_retaddr):
    if (n & 8 != 0):
        flag[ind] = n
        flag[ind+1] = unaff_retaddr
        modif_expected_flag(n+1, flag, ind+2, 0x08)

flags = list(map(ord, list("FCSCFCSCFCSCFCSC")))
modif_expected_flag(74, flags, 0, 0xef)
xor_keys = [0x79, 0x8d, 0x2d, 0x3e, 0x2e, 0x6e, 0x79, 0x6d, 0x28, 0x38, 0x2d, 0x38, 0x77, 0x75, 0x60, 0x21]

xored_flag = [0]*16
res = "".join(list(map(chr, flags)))
for i in range(16):
    xored_flag[i] = xor_keys[i] ^ flags[i]

res = "".join(list(map(chr, xored_flag)))
print(f"FCSC{{{res}}}")

# FCSC{REDACTED}
```
