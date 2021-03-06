/*
* "The contents of this file are subject to the Mozilla Public Licenske
* Version 1.1 (the "License"); you may not use this file except in
* compliance with the License. You may obtain a copy of the License at
* http://www.mozilla.org/MPL/
* 
* Software distributed under the License is distributed on an "AS IS"
* basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
* License for the specific language governing rights and limitations
* under the License.
* 
* The Original Code is confirm-address.
* 
* The Initial Developers of the Original Code are kentaro.matsumae and Meatian.
* Portions created by Initial Developers are 
* Copyright (C) 2007-2011 the Initial Developer.All Rights Reserved.
* 
* Contributor(s): tanabec
*/ 
function startup(){
    
    var okBtn = document.documentElement.getButton("accept");
	okBtn.disabled = true;

	// set button label
	var strbundle = document.getElementById("strings");
	var BtnLabel = strbundle.getString("confirm.dialog.acceptbtn.label");
	okBtn.label = BtnLabel;

	// create internal-domain list
	var internals = window.arguments[1];
	var internalList = document.getElementById("yourDomains");

    for(var i = 0; i < internals.length; i++){
		var address = internals[i];
		var listitem = createListItem(address);
		internalList.appendChild(listitem);
	}

    // if internal-domain was empty, "select all" checkbox set checked.
    // when internalList is empty, internalList.length equals 0.
    if(internals.length == 0){
        document.getElementById("check_all").checked = true;
        document.getElementById("check_all").disabled = true;
    }

    // listheader for internal domains
	var checkboxHeader = document.getElementById("checkbox_header");
	
    checkboxHeader.onclick = function(event){
		
        switchInternalCheckBox(internalList);
		checkAllChecked();
	};

	

	//external domains
	var externals = window.arguments[2];
	var externalList = document.getElementById("otherDomains");
	if(externals.length > 0){
		externalList.setAttribute("style","font-weight: bold; color:#FF0000;");
	}

	for(var i = 0; i < externals.length; i++){
		var address = externals[i];
		var listitem = createListItem(address);
		externalList.appendChild(listitem);
	}	
    
	//attachments list
	var fileNames = window.arguments[3];
	var fileNamesList = document.getElementById("fileNames");
	if (fileNames.length > 0) {
	    fileNamesList.setAttribute("style", "font-weight: bold; color:#FF0000");
   	}

	for (var i = 0; i < fileNames.length; i++) {
		var file = fileNames[i];
		var listitemFileName = createListItem(file);
		fileNamesList.appendChild(listitemFileName);
	}	
}

function createListItem(item){

	var listitem = document.createElement("listitem");
	var cell1 = document.createElement("listcell");
	var checkbox = document.createElement("checkbox");
	checkbox.setAttribute("style", "margin-left:7px;");
	cell1.appendChild(checkbox);
	listitem.appendChild(cell1);
	listitem.checkbox = checkbox;

	listitem.onclick = function(event){
		var chekced = this.checkbox.checked;
		this.checkbox.setAttribute("checked", !chekced);
		checkAllChecked();
	};

	var cell2 = document.createElement("listcell");
	cell2.setAttribute("label", item);
	listitem.appendChild(cell2);
	
	return listitem;
}

function checkAllChecked(){

	//自ドメインのチェック状況を確認
	var yourdomains = document.getElementById("yourDomains");
	var checkboxes = yourdomains.getElementsByTagName("checkbox");
	var isAllcheckON = checkboxes[0].checked; //[すべて確認]チェックボックスの状況
	var internalComplete = true;

	for(var i=1; i<checkboxes.length; i++){
		var chk = checkboxes[i].checked
		if(!chk){
			internalComplete = false;
			break;
		}

	}

    //error
	//checkboxes[0].checked = internalComplete;
	
	//すべてのチェックボックスの状況確認

	var complete = true;
	var checkboxes = document.getElementsByTagName("checkbox");
	for(var i = 0; i < checkboxes.length; i++){
		var cb = checkboxes[i];
		if(cb.id == "check_all") continue;
		if(!cb.checked){
			complete = false;
			break;
		}
	}
	
	//送信ボタンのdisable切り替え
	var okBtn = document.documentElement.getButton("accept");
	if(complete){
		okBtn.disabled = false;
	}else{
		okBtn.disabled = true;
	}
}

//[すべて確認]チェックボックスがONなら、すべての自ドメインアドレスの確認ボックスをONにする。

function switchInternalCheckBox(internalList){

	var checkAll = document.getElementById("check_all");
	var isCheck = checkAll.checked;
checkAll.setAttribute("checked",isCheck);
	var yourdomains = document.getElementById("yourDomains");
	var checkboxes = yourdomains.getElementsByTagName("checkbox");

    document.getElementById("check_all").setAttribute("checked",isCheck);
   
    for(var i=0; i<checkboxes.length; i++){
        checkboxes[i].setAttribute("checked",isCheck);
	}

}

function doOK(){

	var parentWindow = window.arguments[0];
	parentWindow.confmail_confirmOK = true;

	return true;

}


function doCancel(){

	var parentWindow = window.arguments[0];
	parentWindow.confmail_confirmOK = false;
	return true;
}

