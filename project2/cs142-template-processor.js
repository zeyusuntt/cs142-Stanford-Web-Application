'use strict';
function Cs142TemplateProcessor(template) {
    this.template = template;
}

Cs142TemplateProcessor.prototype.fillIn = function(dictionary){ 
    // first replace the havings, the keys of dictionary
    // then delete other formatted ones with 
    for (const key in dictionary) {
        if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
            const old = "{{" + key + "}}";
            this.template = this.template.replace(old, dictionary[key]);
        }
    }
    this.template = this.template.replaceAll(/{{.*?}}/g, "");
    return this.template;
};