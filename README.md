# VSCode extension to push the selected string into *.arb file

## How to Use
1. Clone this repo into your local 
2. Run 
```
  npm install 
  npm run compile
  vsce package 
```
3. Press cmd+shift+p then select Extensions: Install from VSIX 
4. Select localization-adder-0.0.1.vsix file inside the project 
5. After installation, select the text that you want to push it to arb file, then press cmd+shift+p, the select Push to localization
   a. If you are doing this for the first time the it will ask you to select the location of the arb file.
6. Then you will be asked to enter the key value for the text, type the key then press Enter.
7. Now the selected text would be replaced by AppLocalization.of(context).key

### Note : every time you add a value to arb, this extension automatically runs ```flutter pub get``` which will generate the necessary localization files 