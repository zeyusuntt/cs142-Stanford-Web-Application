'use strict';
function Cs142TemplateProcessor(template) {
    this.template = template;
}

Cs142TemplateProcessor.prototype.fillIn = function(dictionary){ 
    // first replace the havings, the keys of dictionary
    // then delete other formatted ones with 
    // for (const key in dictionary) {
    //     if (Object.prototype.hasOwnProperty.call(dictionary, key)) {
    //         const old = "{{" + key + "}}";
    //         if (this.template.innerHTML === old) {
    //             this.template.innerHTML = dictionary[key];
    //         }
    //     }
    // }
    // const str = this.template;
    const arr = this.template.split(" ");
    for (const str of arr) {
        if (str.startsWith("{{") && str.endsWith("}}")) {
            const substring = str.substring(2, str.length-2);
            if (Object.prototype.hasOwnProperty.call(dictionary, substring)) {
                this.template = this.template.replace(str, dictionary[substring]);
            }
            else {
                this.template = this.template.replace(str, "");
            }
        }
    }
    return this.template;
};