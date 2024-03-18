import hljs from "highlight.js"
import markdownit from "markdown-it"

export const mdOpt = {
    html: true,
    xhtmlOut: false,
    break: true,
    langPrefix: "language-",
    linkfy: true,
    typographer: true,
    highlight: (str, lang) => {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value
            } catch (_) {} 
        }
        return ""
    }
}
const md = markdownit(mdOpt)
