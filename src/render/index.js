export function template2Function(html) {

    // 解析html成ast语法树
    let ast = parseAST(html);
    // 根据ast语法树生成render函数
    let render = new Function(gen(ast))

    return render

}

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const endTag = new RegExp(`<\\/${qnameCapture}[^>]*>`);
const attribute = /^\s*([a-zA-Z_:][a-zA-Z0-9_]*)\s*(?:=\s*(?:"([^"]*)"+|'([^']*)'+|([^>\s]+)))?/;
const startTagClose = /^\s*(\/?)>/;
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

function parseAST(html) {


    let root;
    let current = null;
    let stack = []
    while (html) {
        let index = html.indexOf("<")
        if (index == 0) {
            const startTagMatch = html.match(startTagOpen);
            if (startTagMatch) {
                const tagName = startTagMatch[1];
                const attrs = []
                advance(startTagMatch[0].length)
                // 匹配属性直到开始标签的结尾
                let attr;
                let end;
                while ((attr = html.match(attribute)) && (!(end = html.match(startTagClose)))) {
                    attrs.push({ name: attr[1], value: attr[3] || attr[2] || attr[4] })
                    advance(attr[0].length)
                }
                start(tagName, attrs)
                end = html.match(startTagClose)
                if (end) {
                    advance(end[0].length)
                }

            }
            else {
                let endTagMatch = html.match(endTag)
                if (endTagMatch) {
                    end(endTagMatch[1])
                    advance(endTagMatch[0].length)
                }
            }
        }
        if (index > 0) {
            let value = html.substring(0, index)
            advance(index)
            value = value.trim()
            if (value) {
                text(value)
            }

        }

    }

    function advance(n) {
        html = html.substring(n);
    }


    function start(tagName, attrs) {
        if (!root) {
            root = createElement(tagName, attrs)
            current = root
        }
        else {
            current = createElement(tagName, attrs)
        }

        stack.push(current)
    }

    function createElement(tagName, attrs) {
        return {
            tagName,
            attrs: attrs,
            children: [],
            parent: null,
            type: 1,
        }
    }

    function text(text) {
        current.children.push({
            type: 3,
            text,
            parent: current,
        })
    }
    function end() {
        let temp = stack.pop()

        current = stack[stack.length - 1]

        if (current) {
            temp.parent = current
            current.children.push(temp)
        }

    }
    return root
}

function generate(el) {
    let code = "";
    code = `_c(${JSON.stringify(el.tagName)},${el.attrs?.length ? genAttrs(el.attrs) : 'undefined'},
    ${generateChildren(el.children)})`
    return code
}

function gen(el) {
    let code = generate(el)
    code = `with(this){return ${code}}`
    return code
}

function genAttrs(attrs) {
    let obj = {}
    attrs.forEach(element => {
        obj[element.name] = element.value

        if (element.name == "style") {
            let arr = []
            let styleStr = obj[element.name]
            styleStr.split(";").filter((e) => e).forEach((e => {
                arr.push(e.split(":").map((e) => e.trim()))
            }))
            obj[element.name] = Object.fromEntries(arr)
        }
    });

    return JSON.stringify(obj)

}

function generateText(child) {
    let code = ""
    let reg;
    let tokens=[]
    let lastIndex=0
    //处理{{}}
    while (reg = defaultTagRE.exec(child.text)) {
        let index=child.text.indexOf(reg[0])
        if(index>lastIndex){
            tokens.push(JSON.stringify(child.text.substring(lastIndex,index)))
        }
        tokens.push(`_s(${reg[1]})`)
        lastIndex=index+reg[0].length
    }
    //如果没有{{}}，处理普通文本
    if(lastIndex<child.text.length){
        tokens.push(JSON.stringify(child.text.substring(lastIndex)))
    }
    code=tokens.join("+")
    code=`_v(${code})`
    return code;
}

function generateChildren(children) {
    let denChildren = []
    children.forEach((child) => {
        if (child.type == 1) {
            denChildren.push(generate(child))
        }
        else if (child.type == 3) {
            denChildren.push(generateText(child))
        }
    })
    return denChildren.join(",")
}