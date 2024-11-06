import { useEffect, useState } from "react";
import axios from 'axios';
import Card from './Card.jsx';

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function CardDeck() {
    const [deckInfo, setDeckInfo] = useState();
    const [cards, setCards] = useState([]);
    const [shuffling, setShuffling] = useState(false);
    useEffect(() => {
        // console.log('calling for deck');
        async function fetchDeck() {
            const res = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
            // console.log('res: ', res.data);
            setDeckInfo(res.data);
        };
        fetchDeck();
    }, []);              // only call for new deck once - on page refresh
    useEffect(() => {}, [shuffling]);       // redisplay buttons if value of 'shuffling' changes
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!shuffling) {
            if (cards.length >= 52) {
                alert('Error: no cards remaining!');
                return;
            }
            // console.log('submit.. draw from: ', deckInfo);
            const drawRes = await axios.get(`https://deckofcardsapi.com/api/deck/${deckInfo.deck_id}/draw/?count=1`);
            const card = drawRes.data.cards[0];
            // console.log('draw res: ', drawRes.data);
            const newCard = {code: card.code, suit: card.suit, value: card.value};
            // console.log('new: ', newCard);
            setCards(cards => [...cards, newCard]);
        }
    };
    const handleReshuffle = async (e) => {
        e.preventDefault();
        if (!shuffling) {
            // console.log('shuffling');
            setShuffling(true);
            const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckInfo.deck_id}/shuffle/`);
            await wait(500);     // so can see that reshuffle button is grayed out until shuffle done
            setShuffling(false);
            setCards([]);
        }
    }
    return (
      <>
        <div>
           <form onSubmit={handleReshuffle} >
              {shuffling ?  
               <button style={{color: '#aaa'}}> Reshuffle </button> :
               <button> Reshuffle </button>}
           </form>
           <br/>
           <form onSubmit={handleSubmit}>
              {shuffling ?  
               <button style={{color: '#aaa'}}> Draw! </button> :
               <button> Draw! </button>}
           </form>
 
           <ul>
           {cards.map(card => <Card suit={card.suit} value={card.value} key={card.code}/>)}
           </ul>
        </div>
      </>
    )
  }
  
  export default CardDeck