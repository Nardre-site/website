The shellcode below is an alphanumeric quine written in 32-bit x86 assembly. I'll explain how I created it, and you can find the complete source code on my GitHub. [github](https://github.com/Nardre/AlphanumericQuineShellcode)

```asm
ZYQRQPj0X40PZ7AIYfHf5a7f1A0f1A5YBRXBBBRQjDPTUVWaSHSXKSHQuineByNardre
```

---
# Context
"Here are a few definitions from Wikipedia to keep in mind  [Shellcode](https://en.wikipedia.org/wiki/Shellcode#Alphanumeric) [Quine](https://en.wikipedia.org/wiki/Quine_(computing)):
- **Shellcode:** A byte string representing executable binary code.
- **Alphanumeric shellcode:** A shellcode composed exclusively of alphanumeric characters (`0–9`, `A–Z`, and `a–z`).
- **Self modifying code:** Code that alters its own instructions before execution, often to bypass character restrictions.
- **Quine:** A program that takes no input and outputs an exact copy of its own source code."

---
# Quine
Here is the main logic of the shellcode. It simply consists of two syscalls: `sys_write` and `sys_exit`.

*You can consult the 32-bit syscall table [here](https://github.com/torvalds/linux/blob/master/arch/x86/entry/syscalls/syscall_32.tbl), and further details are available in the man pages.
We will not be spawning a shell here, as our focus is purely on the quine itself. However, a shell could easily be integrated using the same techniques covered in this tutorial.
For a deeper explanation of quine shellcode, feel free to check out the [arsouyes website](https://www.arsouyes.org/articles/2025/2025-04-22_Shellcode_Quine/index.en.html).*

![[shellcode0.png]]

---
# Alphanumeric
Here is the list of our allowed instructions.
This table is taken from the [phrack by rix](https://phrack.org/issues/57/15) be sure to check it out for a more explanation.
![[shellcode4.png]]

---
## Mov equivalent

We can zero out `EAX` using:
- `push <imm8>`
- `pop eax`
- `xor al, <imm8>`
![[shellcode6.png]]

---

We can obtain small values using:
- `push <imm32>`
- `pop eax`
- `xor eax, <imm32>`
- `inc r32`, `dec r32`
![[shellcode15.png]]

---

We can set any value where the most significant bytes are zero by using:
- `push <imm32>`
- `pop eax`
- `xor eax, <imm32>`
![[shellcode8.png]]

---

We can set any value where the most significant bytes are non zero by using:
- `dec ax`
- `push <imm32>`
- `pop eax`
- `xor eax, <imm32>`
![[shellcode9.png]]

---

We can move values between registers using:
- `push eax`, `push ebx`, `push ecx`, `push edx`, `push esp`, `push ebp`, `push esi`, `push edi`
- `pop eax`, `pop ecx`, `pop edx`
- `popad`
![[shellcode7.png]]

You can find more information about `POPAD` on [Felix Cloutier's x86 reference site](https://www.felixcloutier.com/x86/popa:popad).
![[shellcode5.png]]

---
## Tricks
We can pad our shellcode or increase its length with NOP-equivalent instructions using:
- `aaa` (can cause problems)
- `inc ecx`, `dec ecx`
- `db "Nardre" (after exit)`
![[shellcode12.png]]
![[shellcode13.png]]

---

We can implement self modifying code as follows, which is particularly useful for crafting an `int 0x80` instruction:
- `xor <r/m32>, <imm32>`
- `xor <r/m8>,<r8>`
- `xor <r/m32>, <r32>`
- `xor <r8>,<r/m8>`
- `xor <r32>,<r/m32>`
![[shellcode11.png]]

---

We can retrieve command line arguments (`argv`) using:
- `pop <r32>`
- `push <r32>`
![[shellcode14.png]]

---

# Alphanumeric Quine Shellcode

With all this information, we can now write our Alphanumeric Quine shellcode.
![[shellcode16.png]]

---

There are two main challenges when creating an alphanumeric quine shellcode:
- **The `int 0x80` instruction:** Mandatory for executing syscalls, but non alphanumeric. This is solved using Self Modifying Code (SMC).
- **Extracting a copy of the shellcode:** Needing an unaltered copy of the payload to print itself. This is solved by reading it directly from `argv` arguments.

The remainder of the shellcode simply consists of the two syscalls and register transfers.

---

Let's compile and execute this program using NASM and the following C wrapper.
Note that the C program must accept the shellcode as a command line argument, and the memory page where it is allocated must be set to readable, writable, and executable (RWX).
```c
#include <stdio.h>
#include <string.h>
#include <sys/mman.h>

int main(int argc, char *argv[]) {
    if (argc != 2) {
        fprintf(stderr, "Usage: %s shellcode\n", argv[0]);
        return 1;
    }

    size_t shellcode_size = strlen(argv[1]);
    void *memory = mmap(0, shellcode_size, PROT_READ|PROT_WRITE|PROT_EXEC, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0);
    if (memory == MAP_FAILED) {
        perror("mmap failed");
        return 1;
    }
    memcpy(memory, argv[1], shellcode_size);

    int (*shellcode)(char*) = memory;
    int status = shellcode(argv[1]);

    munmap(memory, shellcode_size);
    return status;
}

```

```bash
nasm -f bin -o quine.bin quine.s
gcc -m32 -Wall -Wextra -no-pie loader.c -o loader

./loader "$(cat quine.bin)" > out
diff quine.bin out
# ZYQRQPj0X40PZ7AIYfHf5a7f1A0f1A5YBRXBBBRQjDPTUVWaSHSXKSHQuineByNardre
```