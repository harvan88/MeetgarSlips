# tools/verificar_zip.py
from core.zip_utils import verificar_zip

def main(args):
    print("📦 Iniciando verificación ZIP...")  # DEBUG
    if not args:
        print("Uso: python run.py verificar-zip archivo.zip")
        return
    verificar_zip(args[0])
