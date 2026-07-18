# Setup

Quick setup to emulate Mach-O on linux.
```shell
$ file macho    
macho: Mach-O 64-bit x86_64 executable, flags:<NOUNDEFS|DYLDLINK|TWOLEVEL|PIE>
```

```
git clone https://github.com/shinh/maloader
cd maloader  
make release  
./ld-mac ../macho
```

# Error

```bash
make release  
make clean  
make[1]: Entering directory '/home/c2h6/Downloads/maloader'  
rm -f *.o *.d */*.o */*.d libmac.so extract macho2elf ld-mac  
make[1]: Leaving directory '/home/c2h6/Downloads/maloader'  
make all "GCC_EXTRA_FLAGS=-DNOLOG -DNDEBUG"  
make[1]: Entering directory '/home/c2h6/Downloads/maloader'  
cc -g -Iinclude -Wall -MMD -fno-omit-frame-pointer -O -DNOLOG -DNDEBUG -fPIC   -c -o libmac/mac.o libmac/mac.c  
In file included from libmac/mac.c:68:  
libmac/none.c: In function ‘_none_sgetrune’:  
libmac/none.c:59:1: warning: old-style function definition [-Wold-style-definition]  
  59 | _none_sgetrune(string, n, result)  
     | ^~~~~~~~~~~~~~  
libmac/none.c: In function ‘_none_sputrune’:  
libmac/none.c:75:1: warning: old-style function definition [-Wold-style-definition]  
  75 | _none_sputrune(c, string, n, result)  
     | ^~~~~~~~~~~~~~  
In file included from libmac/mac.c:71:  
libmac/stack_protector-obsd.c: At top level:  
libmac/stack_protector-obsd.c:34:10: fatal error: sys/sysctl.h: No such file or directory  
  34 | #include <sys/sysctl.h>  
     |          ^~~~~~~~~~~~~~  
compilation terminated.  
make[1]: *** [<builtin>: libmac/mac.o] Error 1  
make[1]: Leaving directory '/home/c2h6/Downloads/maloader'  
make: *** [Makefile:48: release] Error 2
```

`<sys/sysctl.h>` is deprecated. replace  `#include <sys/sysctl.h>` by `#include <sys/random.h>` in `libmac/stack_protector-obsd.c`
