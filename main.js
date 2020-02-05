import React, { Component } from 'react';
import { Button , Switch } from 'antd';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import SockJS from 'sockjs-client';
import StompJs from 'stompjs';
import Highlighter from "react-highlight-words";
var Stomp = StompJs.Stomp;
var stompClient = null;
import '../css/layout.css';
import ReactCursorPosition from 'react-cursor-position';

const textToHighlight =  "Mind                    what no by kept. Celebrated no he decisively thoroughly. Our asked sex point her she seems "+ 
      "New plenty she horses parish design you. Stuff sight equal of my woody.";
      
class App extends Component{
   constructor(props){
      super(props);
      this.state={
         enableHighlighter : true,
         switchChange : 'Full',
         textHighlighArray : []
      }
    }

   findingIndex = () => {
      let searchWords = ["so", "paper", "the" , "Mind"];
      const { switchChange } = this.state;
      const chunks = [];
      const textLow = textToHighlight.toLowerCase();
      // Match at the beginning of each new word
      // New word start after whitespace or - (hyphen)
      const sep = /[-\s]+/;
  
      // Match at the beginning of each new word
      // New word start after whitespace or - (hyphen)
      const singleTextWords = textLow.split(sep);
  
      // It could be possible that there are multiple spaces between words
      // Hence we store the index (position) of each single word with textToHighlight
      let fromIndex = 0;
      const singleTextWordsWithPos = singleTextWords.map(s => {
        const indexInWord = textLow.indexOf(s, fromIndex);
        fromIndex = indexInWord;
        return {
          word: s,
          index: indexInWord
        };
      });

  
      // Add chunks for every searchWord
      searchWords.forEach(sw => {
        const swLow = sw.toLowerCase();
        // Do it for every single text word
        singleTextWordsWithPos.forEach(s => {
         if(switchChange == 'Full'){
            if (s.word === swLow ) {
               const start = s.index;
               const end = s.index + swLow.length;
               chunks.push({
                  word:s.word,
                  searchWord :swLow,
                 start,
                 end
               });
             }
         }else{
            if (s.word.indexOf(swLow) >-1 && s.word !== swLow ) {
               const start = s.index;
               const end = s.index + swLow.length;
               chunks.push({
   
                 start,
                 end
               });
             }
         }
          
        });
  
        // The complete word including whitespace should also be handled, e.g.
        // searchWord='Angela Mer' should be highlighted in 'Angela Merkel'
      /**  if (textLow.startsWith(swLow)) {
          const start = 0;
          const end = swLow.length;
          chunks.push({
            start,
            end
          });
        } */
      });
      const { enableHighlighter }= this.state;
     // enableHighlighter ? this.setState({ enableHighlighter : false }) : this.setState({ enableHighlighter : true }) ;
      console.log('chunks----------',chunks);
      return chunks;
    };

    switchChange = () => {
      const { switchChange } = this.state;
      switchChange == 'Full' ? this.setState({ switchChange : 'Partial' }) : this.setState({ switchChange : 'Full' });
    }

    selectionFind = (value) => {
       console.log('------------',value)
     var  myElement = document.getElementById('text-element');
      var startPosition = myElement.selectionStart;
      var endPosition = myElement.selectionEnd;
      
      // Check if you've selected text
      if(startPosition == endPosition){
          alert("The position of the cursor is (" + startPosition + "/" + myElement.value.length + ")");
      }else{
          alert("Selected text from ("+ startPosition +" to "+ endPosition + " of " + myElement.value.length + ")");
      }
    }
  
   getSelected = () => {
      const { textHighlighArray } = this.state;
   
      let start = window.getSelection().anchorOffset;
      let end = window.getSelection().focusOffset;
      let tempArray = textHighlighArray;
      if ( start != end ) {
         if( end >  start ) {
         tempArray.push({'start' : start  , 'end' : end }); 
         } else {
         tempArray.push({'start' : end ,'end' : start });
        }
        this.setState({ textHighlighArray : tempArray}, function(){
         console.log('textHighlighArray..', textHighlighArray);
      });
      //const text = this.highlightedText(textHighlighArray);
     // console.log(text);
      }
      }

  highlightedText = (chunks) => { return chunks
  .map(chunk => {
    const { end, start } = chunk;
    const text = textToHighlight.substr(start, end - start);
      return `<mark>${text}</mark>`;
  }).join("");
  }
sendSelected = () => {
   const { textHighlighArray } = this.state;
   return textHighlighArray;
}

   render(){
      let checkarray = [1];
      const { enableHighlighter , switchChange , textHighlighArray  }= this.state;
      return(
         <div>
            {false && <Button type="primary" onClick = {this.findingIndex}>Text Highlight</Button> }
            <Switch style={{float : 'rigth'}} checkedChildren="Full" unCheckedChildren="Partial" defaultChecked onClick = {this.switchChange} />
      
             <p onClick ={this.getSelected}>{textToHighlight}</p>

         <Highlighter
          textToHighlight={textToHighlight}
          findChunks={this.sendSelected}
        />
           
         </div>
      );
   }
}
export default withRouter(connect(null)(App));
