let editMode = false;

function execute() {
  update();

  const element = document.querySelector("[data-test-id*='.quick-add-item.add-attachment']");

  if(!element)
    return;

  if(element.getAttribute("data-custom"))
    return;

  element.setAttribute("data-custom", true);

  const button = document.createElement("div");
  button.setAttribute("role", "presentation");
  button.innerHTML = `
    <span id="custom-edit-button" data-test-id="issue.issue-view.views.issue-base.foundation.quick-add.quick-add-item.edit" data-testid="issue.issue-view.views.issue-base.foundation.quick-add.quick-add-item.edit" class="_2hwxftgi" aria-describedby="9val-tooltip"><button aria-label="Attach" class="css-gon3qk" type="button" tabindex="0"><span id="custom-edit-button-text" class="css-178ag6o"></span></button></span>
  `;
  element.parentElement.before(button);

  const buttonText = document.getElementById("custom-edit-button-text");
  buttonText.innerText = "Unlock edit mode";

  button.querySelector("button").addEventListener("click", () => {
    editMode = !editMode;

    buttonText.innerText = (editMode) ? ("Lock edit mode") : ("Unlock edit mode");

    update();
  });
};

function update() {
  const inlineEditor = document.querySelector("[data-test-id='issue.views.field.rich-text.description']");

  if(!inlineEditor)
    return;

  if(!editMode && inlineEditor.style.pointerEvents !== "none") {
    inlineEditor.style.pointerEvents = "none";

    const rendererDocument = inlineEditor.querySelector(".ak-renderer-document");

    if(rendererDocument && rendererDocument.style.display !== "none") {
      rendererDocument.style.display = "none";

      const rendererDocumentReplacement = document.createElement("div");
      rendererDocumentReplacement.id = "custom-document-renderer";

      rendererDocumentReplacement.innerHTML = rendererDocument.innerHTML;

      rendererDocument.after(rendererDocumentReplacement);
    }
  }
  else if(editMode && inlineEditor.style.pointerEvents === "none") {
    inlineEditor.style.pointerEvents = "initial";

    const rendererDocument = inlineEditor.querySelector(".ak-renderer-document");

    if(rendererDocument && rendererDocument.style.display === "none") {
      rendererDocument.style.display = "initial";

      const customDocumentRenderer = document.getElementById("custom-document-renderer");

      if(customDocumentRenderer)
        customDocumentRenderer.remove();
    }
  }
}

const config = { attributes: false, childList: true, subtree: true };

const observer = new MutationObserver(() => execute());

observer.observe(document.getElementById("jira-frontend"), config);

let observingPortalContainer = false;

const bodyObserver = new MutationObserver(() => {
  const portalContainer = document.querySelector(".atlaskit-portal-container");

  if(portalContainer && !observingPortalContainer) {
    observingPortalContainer = true;

    observer.observe(portalContainer, config);
  }
  else if(!portalContainer && observingPortalContainer) {
    observingPortalContainer = false;
  }
});

bodyObserver.observe(document.body, config);
