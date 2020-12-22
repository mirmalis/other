testing := True
#Include C:\GoogleDrive\Projects\AHK\Lib\string_object.ahk
#Include JSON.ahk
; tbd: change guiExists into active check if guiIsActive. ESC key should still close GUI if it is not in focus.
; tbd: save withouth keys OR load as asoc arrays so lower index data is deleted they dont come back as emties. or check if value is empty if so - delete from data on read time that will cause values to be inserted in unpredictable places.
#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
#UseHook, On ; Prevents ahk from triggering it's own hotkeys.
  SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
  SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.
  SetTitleMatchMode, 2
  CoordMode, ToolTip, Screen
  Menu, Tray, Icon, icons/Knife.ico
; constants
  gui_width := 150
  tooltip_reaction_time := 1000
  tooltip_id := 10
  tooltip_shows := ""
; Variable declaration
  guiExists := False
  saveFileName := "clipboard.txt"

  if FileExist(saveFileName) {
    FileRead, OutputVar, %saveFileName%
    Clip := JSON.Load(OutputVar)
  } else {
    Clip := JSON.Load("[]")
  }
OnExit, SaveData
#If testing
  ;Clip.Insert("a", "AAA")
  ;Clip.Insert("b", "BBB")
  ;Clip.Insert("CCC")
  PgDn::
    ifwinactive, .ahk
      Send ^s
    Reload
    Return
  !Esc::ExitApp

#If
~^c::
  Sleep, 50
  ClipWait, 2
  Clip.Insert(Clipboard)
  Return
!c:: ; MultiClipboard
  SendInput, ^c
  Input, OutputVar, L1
  Clip[OutputVar] := Clipboard
  Return
!v::
  Input, OutputVar, L1
  SendInput, % Clip[OutputVar]
  Return
^Insert::
ShowGui:
  if (!guiExists) {
    Gui, Add, ListView, r8 w%gui_width% gMyListView vMyListView Grid, Key|Value
    Gui, Add, Button, Default gButtonOK, OK
    For Key, Val in Clip {
      Val := StrReplace(val, "`n)`n", "`n`) `n")
      LV_Add("", Key, Val)
    }
    guiExists := True
    LV_Modify(1,"Focus Select")
    Gui, Show, x0 y0
    SetTimer, showThisToolTip, %tooltip_reaction_time%
  } else {
    Goto, CloseGui
  }
  Return
ButtonOK:
MyListView:
  vRowNumber := LV_GetNext(0, "Focused")
  if (vRowNumber > 0) {
    LV_GetText(selectedText, vRowNumber, 2)
    Gosub, CloseGui
    Clipboard := selectedText
    Send, ^v
  }
  Return
CloseGui:
  guiExists := False
  SetTimer, showThisToolTip, Off
  ToolTip,,,, tooltip_id
  Gui, Destroy
  Return
SaveData:
  FileDelete, %saveFileName%
  save_string := JSON.Dump(Clip,, 2)
  if (save_string != "[]" and save_string != "{}")
    FileAppend, %save_string%, %saveFileName%
  ExitApp
  Return

#If guiExists
  Esc::
    Goto, CloseGui
    Return
  Delete::
    SetTimer, showThisToolTip, %tooltip_reaction_time%
    vRowNumber := LV_GetNext(0, "Focused")
    LV_GetText(vKey, vRowNumber, 1)
    Clip.Delete(vKey)
    LV_Delete(vRowNumber)
    LV_Modify(0, "-Select")  ; to deselect all selected rows
    LV_Modify(vRowNumber,"Focus Select")
    ToolTip,,,, tooltip_id
    Return
  Up::
    SetTimer, showThisToolTip, %tooltip_reaction_time%
    if (LV_GetNext(0, "Focused") == 1) {
      LV_Modify(0, "-Select")
      LV_Modify(LV_GetCount(), "Focus Select")
    } else {
      SendInput, {Up}
    }
    Return
  Down::
    SetTimer, showThisToolTip, %tooltip_reaction_time%
    if (LV_GetCount() == LV_GetNext(0, "Focused"))
    {
      LV_Modify(0, "-Select")
      LV_Modify(1, "Focus Select")
    } else {
      SendInput, {Down}
    }
    Return

showThisToolTip:
  vRowNumber := LV_GetNext(0, "Focused")
  if (vRowNumber > 0) {
    LV_GetText(selectedText, vRowNumber, 2)
    if (tooltip_shows != selectedText) {
      ToolTip, %selectedText%, gui_width+26, 0, tooltip_id
      tooltip_shows := selectedText
    }
  }
  Return