# core/zip_utils.py
import zipfile

def verificar_zip(path):
    try:
        with zipfile.ZipFile(path) as z:
            bad = z.testzip()
            if bad is None:
                print("✅ ZIP válido.")
            else:
                print(f"❌ Archivo dañado dentro del ZIP: {bad}")
    except FileNotFoundError:
        print(f"❌ No se encontró el archivo: {path}")
    except zipfile.BadZipFile:
        print("❌ El archivo no es un ZIP válido.")
    except Exception as e:
        print(f"❌ Error desconocido: {e}")
