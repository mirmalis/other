#NoEnv
  SendMode Input
  SetWorkingDir %A_ScriptDir%

  log = ""
  if %1% {
    vlc_path = %1%
  } else {
    IfExist, C:\Program Files (x86)\VideoLAN\VLC\vlc.exe
      vlc_path := "C:\Program Files (x86)\VideoLAN\VLC\vlc.exe"
    IfExist, C:\Program Files\VideoLAN\VLC\vlc.exe
      vlc_path := "C:\Program Files\VideoLAN\VLC\vlc.exe"
  }
  IfNotExist, %vlc_path% 
  {
    MsgBox, Can't find vlc.exe. Supply path to it as 1st call parameter.
    ExitApp
  }

  files := {}
  logs := {}
  gui_width := 150
  asd := 0
  Gui, Margin, -1, -1
  Loop, Files, *, R
  {
    RegExMatch(A_LoopFileLongPath, "O)(\d*)([\s\w\d_]*)\.(mp3|flac)", Match)
    if (Match[1] != last_group) 
      asd := 99999
    var := Match[2]
    asd := asd + GetTextSize(var)
    if (var != ""){
      if (asd > gui_width){ ; do same Lines
        Gui, Add, Button, x0 y+m gplayMp3, %var%
        asd := 0
      } else { ; start another line
        Gui, Add, Button, x+m gplayMp3, %var%
      }
      last_group := Match[1]
      width := GetTextSize(var)*8
      files[var] := A_LoopFileLongPath
    }
  }
  asd := 99999
  Loop, Read, log.txt
  {
    if (A_LoopReadLine = "") {
      lastLineEmpty := true
      Continue
    }
    split := StrSplit(A_LoopReadLine, ">")
    var := split[1]
    asd := asd + GetTextSize(var)
    if (var != ""){
      if ((asd > gui_width) || (lastLineEmpty)){ ; do same Lines
        Gui, Add, Button, x0 y+m gcmd, %var%
        asd := 0
      } else { ; start another line
        Gui, Add, Button, x+m gcmd, %var%
      }
    }
    logs[var] := RegExReplace(split[2], "^\|*", "")
    lastLineEmpty := false
  }


  Gui, Add, Button, x0 w98 gCloseAll, Stop playing
  Gui, Add, Button, yp x97 gSaveLog vSaveLog Disabled, Save Log
  Gui, Add, Button, x0 w98 gClose , Close audiomaster
  Gui, Add, Button, yp x97 gClearLog vClearLog Disabled, Clear Log
  Gui,+AlwaysOnTop -MaximizeBox -MinimizeBox
  Gui, Show
Return
GetTextSize(pStr, pSize=8, pFont="", pHeight=false) {
   Gui 9:Font, %pSize%, %pFont%
   Gui 9:Add, Text, R1, %pStr%
   GuiControlGet T, 9:Pos, Static1
   Gui 9:Destroy
   Return pHeight ? TW "," TH : TW
}
cmd:
  do_stop := False
  split := StrSplit(logs[A_GuiControl], "|")

  
  Loop, % split.Length()
  {
    if(RegExMatch(split[A_Index], "^Sleep")){
        split_2 := StrSplit(split[A_Index], " ")
        Sleep split_2[2]
      } Else {
        Run, % split[A_Index]
      }
    if (do_stop) {
      Return
    }
  }
Return
SaveLog:
  InputBox, output, replay name
  log := output . log . "`r`n"
  FileAppend, %log%, log.txt
  GoTo, ClearLog
  Return
ClearLog:

  log := ""
  last_usage_time := ""
  GuiControl, Disable, SaveLog
  GuiControl, Disable, ClearLog
  Return
playMp3:
  var := A_GuiControl

  ;command := """" . vlc_path . """ """ . files[var] . """ --no-qt-system-tray --play-and-exit " 
  command :=  """" . vlc_path . """ -I null --play-and-exit  --no-one-instance """ . files[var] . """"
  if(last_usage_time){
    timeElapsed := A_TickCount - last_usage_time
    log := log . "|Sleep " . timeElapsed
  } else {
    log := ">"
  }
  last_usage_time := A_TickCount
  log := log . "|" . command
  Run, %command%
  GuiControl, Enable, SaveLog
  GuiControl, Enable, ClearLog
Return
CloseAll:
  do_stop := True
  Process, Close, vlc.exe
  while (ErrorLevel <> 0) {
    Process, Close, vlc.exe
    Process, Exist, vlc.exe
  }
Return
GuiClose:
Close:
  exitapp
Return
Exit:
^Esc::
  Gosub, CloseAll
  exitapp
Return
; sound slider