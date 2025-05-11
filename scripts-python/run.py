# run.py
import sys

SCRIPTS = {
    "verificar-zip": "tools.verificar_zip",
    # Agregá más comandos aquí si sumás scripts
}

def main():
    if len(sys.argv) < 2 or sys.argv[1] not in SCRIPTS:
        print("Uso: python run.py [comando] [argumentos]")
        print("Comandos disponibles:")
        for cmd in SCRIPTS:
            print(f"  - {cmd}")
        return

    module_name = SCRIPTS[sys.argv[1]]
    script_args = sys.argv[2:]

    module = __import__(module_name, fromlist=["main"])
    module.main(script_args)

if __name__ == "__main__":
    main()
