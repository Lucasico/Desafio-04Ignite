import { Component } from "react";

export default class Comments extends Component {
  componentDidMount() {
    const script = document.createElement("script");
    const anchor = document.getElementById("inject-comments-for-uterances");
    script.setAttribute("src", "https://utteranc.es/client.js");
    script.setAttribute("crossorigin", "anonymous");
    script.setAttribute("async", "true");
    script.setAttribute("repo", "Lucasico/Desafio-04Ignite");
    script.setAttribute("issue-term", "pathname");
    script.setAttribute("theme", "github-dark");
    anchor.appendChild(script);
  }

  render() {
    return <div id="inject-comments-for-uterances" />;
  }
}
// https://github.com/utterance/utterances/issues/161
// Como o utteranc.es é adicionado a um repositorio, os comentarios são repetidos entre os posts,
// para fazer um comentário por post deve-se, fazer uma logica para cada poste ser atribuida a um
// repositorio publico com o utteranc instalado nele...
