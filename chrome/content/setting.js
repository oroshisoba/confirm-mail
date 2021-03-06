/* "The contents of this file are subject to the Mozilla Public Licenske
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
var selectedItem;

var CA_CONST = {
	DOMAIN_LIST : "net.nyail.tanabec.confirm-mail.domain-list",
	IS_NOT_DISPLAY : "net.nyail.tanabec.confirm-mail.not-display",
	IS_COUNT_DOWN : "net.nyail.tanabec.confirm-mail.is-countdown",
	COUNT_DOWN_TIME : "net.nyail.tanabec.confirm-mail.cd-time",
};

function startup(){

	//init domain list.
	document.getElementById("add").addEventListener('command', add, true);
	document.getElementById("edit").addEventListener('command', edit, true);
	document.getElementById("remove").addEventListener('command', remove, true);
	var groupList = document.getElementById("group-list");

	var domains = nsPreferences.copyUnicharPref(CA_CONST.DOMAIN_LIST);
	dump("[registed domains] " + domains + "\n");


	if(domains != null && domains != "" ){
		var domainList = domains.split(",");

		for(var i=0; i < domainList.length; i++){
			var listitem = document.createElement("listitem");
			listitem.setAttribute("label", domainList[i]);
			listitem.setAttribute("id", Math.random());
			groupList.appendChild(listitem);
		}
	}else{
		nsPreferences.setUnicharPref(CA_CONST.DOMAIN_LIST,"");
	}

	//init checkbox [not dispaly when only my domain mail]
	var isNotDisplay = nsPreferences.getBoolPref(CA_CONST.IS_NOT_DISPLAY, false);
	var noDisplayBox = document.getElementById("not-display");
	noDisplayBox.checked=isNotDisplay;
	
	//init checkbox [countdown]
	var cdBox = document.getElementById("countdown");
	var cdTimeBox = document.getElementById("countdown-time");

	cdBox.addEventListener('command',
		function(event){
			cdTimeBox.disabled = !cdBox.checked;
		},
		true);

	var isCountDown = nsPreferences.getBoolPref(CA_CONST.IS_COUNT_DOWN, false);
	if(isCountDown == null || isCountDown == false){
		cdBox.checked = false;
		cdTimeBox.disabled = true;
	}else{
		cdBox.checked = true;
		cdTimeBox.disable = false;
	}

	var countDonwTime = nsPreferences.copyUnicharPref(CA_CONST.COUNT_DOWN_TIME);
	cdTimeBox.value = countDonwTime;
}

function add(event){
	window.confmail_confirmOK = false;
	window.domainName = null;
	window.openDialog("chrome://confirm-mail/content/setting-add-domain.xul",
		"ConfirmAddressDialog", "chrome,modal,titlebar,centerscreen", window);

	if(window.confmail_confirmOK){
		var domainName = window.domainName;
		
		// check duplication
		if(domainName.length > 0  
			&& nsPreferences.copyUnicharPref(CA_CONST.DOMAIN_LIST).indexOf(domainName) == -1){

			dump("[add!] " + domainName + "\n");
			var groupList = document.getElementById("group-list");
			var listitem = document.createElement("listitem");
			listitem.setAttribute("label", domainName);
			listitem.setAttribute("id", Math.random());
			groupList.appendChild(listitem);
		
			saveDomainName();	
		
		}else{
			alert("入力されたドメイン名は既に登録されています。\nThe domain name already registered.");
		}
	}
}
function edit(event){
	window.confmail_confirmOK = false;
	window.domainName = selectedItem.label;
	window.openDialog("chrome://confirm-mail/content/setting-add-domain.xul",
		"ConfirmAddressDialog", "chrome,modal,titlebar,centerscreen", window);
		
	if(window.confmail_confirmOK){
		var domainName = window.domainName;
		
		//check duplication
		if(selectedItem.label==domainName 
			|| (domainName.length > 0 
				&& nsPreferences.copyUnicharPref(CA_CONST.DOMAIN_LIST).indexOf(domainName) == -1)){

			dump("[edit!] " + domainName + "\n");
			selectedItem.setAttribute("label", domainName);
			saveDomainName();	

		}else{
			alert("入力されたドメイン名は既に登録されています。\nThe domain name already registered.");
		}
	}
}
function remove(event){
	var groupList = document.getElementById("group-list");
	dump("[remove] "+selectedItem + "\n");
	groupList.removeChild(selectedItem);
	saveDomainName();
}

function selectList(item){
	selectedItem = item;
}

function saveDomainName(){
	
	//ドメイン設定保存
	var groupList = document.getElementById("group-list");
	var domainList = new Array();
	var nodes = groupList.childNodes;
	for(var i = 0; i < nodes.length; i++){
		if(nodes[i].nodeName == "listitem"){
			domainList.push(nodes[i].label);
		}
	}
	var domainListStr = domainList.join(",");
	nsPreferences.setUnicharPref(CA_CONST.DOMAIN_LIST, domainListStr);
}

function doOK(){
	dump("[OK]\n");

	//チェックボックス設定保存
    
	var notDisplay = document.getElementById("not-display").checked;
	nsPreferences.setBoolPref(CA_CONST.IS_NOT_DISPLAY, notDisplay);

	var isCountdown = document.getElementById("countdown").checked;
	nsPreferences.setBoolPref(CA_CONST.IS_COUNT_DOWN, isCountdown);

	var cdTime = document.getElementById("countdown-time").value;
	
	//Error check 
	if(/^(?:0|[1-9][0-9]*)$/.test(cdTime.toString())==false && isCountdown){
		alert("カウントダウン時間には整数を入力してください。\nPlease input integer.");
		return false;
	}
	
	if((Number(cdTime) < 1 || Number(cdTime) >= 3000) && isCountdown){
		alert("カウントダウン時間には1から3000までの範囲で整数を入力してください。\nplease input integer 1 to 3000.");
		return false;
	}

	nsPreferences.setUnicharPref(CA_CONST.COUNT_DOWN_TIME, cdTime);

	return true;
}

function doCancel(){
	dump("[cancel]\n");
	return true;
}

