import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import '../css/layout.css';
import { Markup } from 'interweave';

let textToHighlight = "Mind what no by kept. Celebrated no he decisively thoroughly. Our asked sex point her she seems " +
   "New plenty she horses parish design you. Stuff sight equal of my woody." +
   "Him children bringing goodness suitable she entirely put far daughter." +
   "Any delicate you how kindness horrible outlived servants." +
   "You high bed wish help call draw side. Girl quit if case mr sing as no have. " +
   "At none neat am do over will. Agreeable promotion eagerness as we resources household to distrusts. " +
   "Polite do object at passed it is. Small for ask shade water manor think men begin. " +
   "Dwelling and speedily ignorant any steepest. Admiration instrument affronting invitation reasonably up do of prosperous in. " +
   "Shy saw declared age debating ecstatic man. Call in so want pure rank am dear were. Remarkably to continuing in surrounded diminution on." +
   "In unfeeling existence objection immediate repulsive on he in. Imprudence comparison uncommonly me he difficulty diminution resolution. Likewise proposal differed scarcely dwelling as on raillery. September few dependent extremity own continued and ten prevailed attending. Early to weeks we could. " +
   "Their could can widen ten she any. As so we smart those money in. Am wrote up whole so tears sense oh. Absolute required of" +
   "reserved in offering no. How sense found our those gay again taken the. Had mrs outweigh desirous sex overcame. " +
   "Improved property reserved disposal do offering me. " +
   "Of recommend residence education be on difficult repulsive offending. Judge views had mirth table seems great him for her. " +
   "Alone all happy asked begin UnHighlighty stand own get. Excuse ye seeing result of we. See scale dried songs old may not. " +
   "Promotion did disposing you household any instantly. Hills we do under times at first short an. " +
   "An so vulgar to on points wanted. Not rapturous resolving continued household northward gay. He it otherwise supported instantly." +
   "Unfeeling agreeable suffering it on smallness newspaper be. So come must time no as. Do on unpleasing possession as of unreserved. " +
   "Yet joy exquisite put sometimes enjoyment perpetual now. Behind lovers eat having length horses vanity say had its. " +
   "Seen you eyes son show. " +
   "Far two unaffected one alteration apartments celebrated but middletons interested. " +
   "Described deficient applauded consisted my me do. " +
   "Passed edward two talent effect seemed engage six. On ye great do child sorry lived. Proceed cottage far letters ashamed get clothes day. Stairs regret at if matter to. On as needed almost at basket remain. By improved sensible servants children striking in surprise. " +
   "Inhabiting discretion the her dispatched decisively boisterous joy. " +
   "So form were wish open is able of mile of. Waiting express if prevent it we an musical. " +
   "Especially reasonable travelling she son. Resources resembled forfeited no to zealously. " +
   "Has procured daughter how friendly followed repeated who surprise. Great asked oh under on voice downs. " +
   "Law together prospect kindness securing six. Learning why get hastened smallest cheerful. " +
   "Among going manor who did. Do ye is celebrated it sympathize considered." +
   "May ecstatic did surprise elegance the ignorant age. Own her miss cold last. " +
   "It so numerous if he outlived disposal. How but sons mrs lady when." +
   "Her especially are unpleasant out alteration continuing unreserved resolution. " +
   "Hence hopes noisy may china UnHighlighty and. Am it regard stairs branch thirty length afford. " +
   "Game of as rest time eyes with of this it. Add was music merry any truth since going." +
   "Happiness she ham but instantly put departure propriety. She amiable all without say spirits shy clothes morning. " +
   "Frankness in extensive to belonging improving so certainty. " +
   "Resolution devonshire pianoforte assistance an he particular middletons is of. Explain ten man uncivil engaged conduct. " +
   "Am likewise betrayed as declared absolute do. Taste oh spoke about no solid of hills up shade. Occasion so bachelor humoured striking by attended doubtful be it.";

class App extends Component {
   constructor(props) {
      super(props);
      this.state = {
         textHighlighArray: []
      }
   }

   getSelected = () => {
      const { textHighlighArray } = this.state;

      let start = window.getSelection().anchorOffset;
      let end = window.getSelection().focusOffset;
      let tempArray = textHighlighArray;
      if (start != end) {
         if (end > start) {
            tempArray.push({ 'start': start, 'end': end });
         } else {
            tempArray.push({ 'start': end, 'end': start });
         }
         this.setState({ textHighlighArray: tempArray }, function () {
            console.log('textHighlighArray..', textHighlighArray);
         });

         this.highlight()
      }
   }

   highlight = () => {
      let sel, range;
      sel = window.getSelection();
      if (sel.rangeCount && sel.getRangeAt) {
         range = sel.getRangeAt(0);
      }
      // Set design mode to on
      document.designMode = "on";
      if (range) {
         sel.removeAllRanges();
         sel.addRange(range);
      }
      // Colorize text
      document.execCommand("ForeColor", false, "#fc0000");
      document.execCommand("bold");
      // Set design mode to off
      document.designMode = "off";
   }

   render() {
      return (
         <p onClick={this.getSelected} > <Markup content={textToHighlight} /> </p>
      );
   }
}
export default withRouter(connect(null)(App));