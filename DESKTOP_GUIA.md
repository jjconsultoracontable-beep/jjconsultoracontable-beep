# Guía para Ejecutar SIFEN ELITE como Aplicación de Escritorio (.exe / Windows)

Para que la aplicación de tu computadora se vea ** EXACTAMENTE IDÉNTICA** a la vista previa que ves aquí a la derecha (con el diseño oscuro Slate/Amber, pestañas de POS Ventas, Inventario, Certificado Digital, Usuarios, Clientes, CDC de 44 dígitos, PDF A4, Ticket 80mm y XML de la SET/DNIT), la mejor opción es empaquetarla con **Electron**.

## Opción 1: Empaquetar esta misma aplicación con Electron (Recomendado)

Electron convierte esta misma interfaz web en una aplicación nativa de escritorio ejecutable (`.exe`).

### Pasos:
1. En la carpeta de este proyecto, abre tu terminal y ejecuta:
   ```bash
   npm install
   npm run build
   ```
2. Instala Electron e instala `electron-builder`:
   ```bash
   npm install --save-dev electron electron-builder
   ```
3. Ejecuta la aplicación directamente en ventana de escritorio:
   ```bash
   npx electron electron-main.cjs
   ```
4. Para generar el instalador ejecutable `.exe` para Windows:
   ```bash
   npx electron-builder --win
   ```

---

## Opción 2: Instalar como PWA (Aplicación de Escritorio Web desde el navegador)

Si abres el enlace de la aplicación en Chrome o Microsoft Edge:
1. Haz clic en los **3 puntos del navegador** (arriba a la derecha).
2. Selecciona **Guardar y compartir** -> **Instalar SIFEN Elite**.
3. Se creará un acceso directo en tu Escritorio de Windows y se abrirá en una ventana independiente sin barra de navegación.

---

## Opción 3: Si deseas ejecutar un lanzador de escritorio en Python (PySide6 / WebEngine)

Si prefieres usar un script en Python que abra esta app en una ventana nativa de Windows sin usar navegadores externos:

```python
import sys
from PySide6.QtCore import QUrl
from PySide6.QtWidgets import QApplication, QMainWindow
from PySide6.QtWebEngineWidgets import QWebEngineView

class SifenDesktopApp(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("SIFEN ELITE v14.0 - Facturación Electrónica Paraguay")
        self.setGeometry(100, 100, 1280, 800)
        
        self.browser = QWebEngineView()
        # Puedes apuntar a la URL desplegada o al servidor local dist/
        self.browser.setUrl(QUrl("https://ais-dev-purhjopggl6zjqgofrb4nj-615755407293.us-east1.run.app"))
        self.setCentralWidget(self.browser)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = SifenDesktopApp()
    window.show()
    sys.exit(app.exec())
```
