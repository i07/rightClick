/* global brackets, define, window, document */

define(function (require, exports, module) {
    
    var CommandManager  = brackets.getModule("command/CommandManager");
    var Menus           = brackets.getModule("command/Menus");
    var EditorManager   = brackets.getModule("editor/EditorManager");
    var AppInit         = brackets.getModule("utils/AppInit");
    var bracketsStrings = brackets.getModule("strings");
    
    var rightClickCut   = "rightClick.Cut"; 
    var rightClickCopy  = "rightClick.Copy";
    var rightClickPaste = "rightClick.Paste";
        
    var rightClick      = {};
                                 
    rightClick = {
        
        storedValue : "",
        
        init : function() {
            //whatever we want to do at AppInit
        },
        
        getSelectedText : function() {
            
            var text = "";

            if (window.getSelection) {
                text = window.getSelection().toString();
            } else if (document.selection && document.selection.type != "Control") {
                text = document.selection.createRange().text;
            }

            return text;
    
        },
        
        copyToClipboard : function (text) {
            if (window.clipboardData) { // Internet Explorer
                window.clipboardData.setData("Text", text);
            } else {  
                unsafeWindow.netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");  
                const clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].getService(Components.interfaces.nsIClipboardHelper);  
                clipboardHelper.copyString(text);
            }
        },
        
        cut : function() {
            
            var editor = EditorManager.getCurrentFullEditor();
            rightClick.storedValue = rightClick.getSelectedText();
            rightClick.copyToClipboard(rightClick.storedValue);
            editor._codeMirror.replaceSelection('');
        
        },
        
        copy : function() {
            rightClick.storedValue = rightClick.getSelectedText();
            rightClick.copyToClipboard(rightClick.storedValue);
        },
        
        paste : function() {
            var editor = EditorManager.getCurrentFullEditor();
            var cursor = editor._codeMirror.getCursor();
            
            editor._codeMirror.replaceRange(rightClick.storedValue, cursor, cursor);
            editor._codeMirror.setCursor(cursor.line, cursor.ch + rightClick.storedValue.length);
        }
    };
    
    AppInit.appReady(function () {
        //delegate the AppInit into the rightClick object
        rightClick.init();
    });

    CommandManager.register(bracketsStrings.CMD_CUT,    rightClickCut,  rightClick.cut);
    CommandManager.register(bracketsStrings.CMD_COPY,   rightClickCopy, rightClick.copy);
    CommandManager.register(bracketsStrings.CMD_PASTE,  rightClickPaste,rightClick.paste);
    
    Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU).addMenuDivider();
    
    Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU).addMenuItem(rightClickCopy);
    Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU).addMenuItem(rightClickPaste);
    Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU).addMenuItem(rightClickCut);
    
});