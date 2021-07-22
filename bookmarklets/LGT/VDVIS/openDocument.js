javascript:(
  function(){
    let value = prompt("dokumento numeris (AM_XXXXXXX)");
		if (value != null && value.match(/AM_\d*/)){
			window.location.href = `https://vdvis.am.lt/cs/idcplg?IdcService=REVIEW_WORKFLOW_DOC&dDocName=${value.trim()}&coreContentOnly=1`;
		}
  }()
)
