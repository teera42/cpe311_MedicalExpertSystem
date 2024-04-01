import React, { useState, useEffect } from 'react';
import './Chatdesign.css';
import axios from 'axios';
import sao from '../picture/SAO-Poster.jpg'
import emoji from '../picture/emoji.gif'
import game from '../picture/honkai-star-rail.png'
import food from '../picture/food.jpg'
import kuru from '../picture/kuruu.gif'
function Chatpage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [facts, setFacts] = useState([]);
  const [rules, setRules] = useState([]);
  const [startNodes, setStartNodes] = useState([]);
  const [concludeNodes, setConcludeNodes] = useState([]);
  console.log(facts)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const initialBotMessage = { text: 'สวัสดีค่ะ ดิฉันชื่อ k-inference ยินดีให้บริการถามตอบค่ะ', sender: 'bot' };
        setMessages([initialBotMessage]);
  
        const factResponse = await axios.get('http://localhost:3030/fact');
        setFacts(factResponse.data);
  
        const ruleResponse = await axios.get('http://localhost:3030/rule');
        setRules(ruleResponse.data);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
  
    fetchInitialData();
  }, []);
  
  const fetchFacts = async () => {
    try {
      const factResponse = await axios.get('http://localhost:3030/fact');
      setFacts(factResponse.data);
    } catch (error) {
      console.error('Error fetching facts:', error);
    }
  };

  useEffect(() => {
    getStartNodes();
    const concludeNodes = getConcludeNodes();
    setConcludeNodes(concludeNodes);
  }, [rules]);

  const getStartNodes = () => {
    const foundStartNodes = [];
    for (const rule of rules) {
      if (
        rule.premise1 &&
        (!rule.conclude1 || !rules.some(r => r.conclude1 === rule.premise1)) &&
        (!rule.conclude2 || !rules.some(r => r.conclude2 === rule.premise1)) &&
        (rule.conclude1 !== null && rule.conclude1 !== undefined || 
         rule.conclude2 !== null && rule.conclude2 !== undefined)
      ) {
        foundStartNodes.push({
          startPremise: rule.premise1
        });
      } 
       if (
        rule.premise2 &&
        (!rule.conclude1 || !rules.some(r => r.conclude1 === rule.premise2)) &&
        (!rule.conclude2 || !rules.some(r => r.conclude2 === rule.premise2)) &&
        (rule.conclude1 !== null && rule.conclude1 !== undefined || 
         rule.conclude2 !== null && rule.conclude2 !== undefined)
      ) {
        foundStartNodes.push({
          startPremise: rule.premise2
        });
      }
    }
    setStartNodes(foundStartNodes);
};

  const getConcludeNodes = () => {
    const foundConcludeNodes = [];
  
    for (const rule of rules) {
      const isConcludeNodePremise1 = 
      !rules.some(r => 
          (r.premise1 === rule.conclude1 || r.premise1 === rule.conclude2)
      );

      const isConcludeNodePremise2 = 
      !rules.some(r => 
          (r.premise2 === rule.conclude1 || r.premise2 === rule.conclude2)
      );
      
      if (isConcludeNodePremise1 && isConcludeNodePremise2) {
          if (rule.conclude1) {
              foundConcludeNodes.push(rule.conclude1);
          } else if (rule.conclude2) {
              foundConcludeNodes.push(rule.conclude2);
          }
      }
    }
    return foundConcludeNodes;
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') {
        return;
    }

    const userMessage = { text: inputValue, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');

    const lowerCaseInput = inputValue.trim().toLowerCase();

    switch (true) {
      case lowerCaseInput.includes('อาการสำคัญ') || lowerCaseInput.includes('มีประวัติ') || lowerCaseInput.includes('ผลตรวจ'):
          const startNode = getAllstartNode();
          if (startNode) {
              const correspondingFact1 = facts.find(fact => fact.Name === startNode.startPremise);
              if (correspondingFact1 != null) {
                  const botMessage1 = {
                      text: `คุณมี${correspondingFact1.Description}หรือไม่? กรุณาตอบเป็น(true/false)`,
                      sender: 'bot',
                      nextStartNode: startNode
                  };
                  setMessages(prevMessages => [...prevMessages, botMessage1]);
              } else {
                  const botMessageError1 = { text: 'ไม่พบข้อมูลเกี่ยวกับโหนดเริ่มต้น', sender: 'bot' };
                  setMessages(prevMessages => [...prevMessages, botMessageError1]);
              }
          }
          break;
          case lowerCaseInput.includes('สวัสดี'):
            const greetingMessage = { text: 'สวัสดีจ้า', sender: 'bot' };
            setMessages(prevMessages => [...prevMessages, greetingMessage]);
            break;
        case lowerCaseInput.includes('สบายดี'):
            const howAreYouMessage = { text: 'ฉันสบายดี กินข้าวยังจ้ะ', sender: 'bot' };
            setMessages(prevMessages => [...prevMessages, howAreYouMessage]);
            break;
        case lowerCaseInput.includes('กินข้าวยัง'):
            const eatMessage = { text: 'ฉันกินไม่ได้จ่ะ เธอล่ะกินข้าวยังจ้ะ', sender: 'bot' };
            setMessages(prevMessages => [...prevMessages, eatMessage]);
        break;
       case lowerCaseInput.includes('เลิกถาม'):
              const stopAskingMessage = { text: 'ได้ครับ แต่กินข้าวยังครับ', sender: 'bot' };
              setMessages(prevMessages => [...prevMessages, stopAskingMessage]);
              break;
          case lowerCaseInput.includes('ทำอะไรอยู่'):
              const doingMessage = { text: 'พยายามช่วยเหลือท่านอย่างเต็มที่อยู่จ่ะ', sender: 'bot' };
              setMessages(prevMessages => [...prevMessages, doingMessage]);
              break;
          case lowerCaseInput.includes('ช่วยอะไรหน่อยได้ไหม','ช่วยด้วย'):
              const helpMessage = { text: 'ได้ทุกอย่างตามสั่งค่ะ', sender: 'bot' };
              setMessages(prevMessages => [...prevMessages, helpMessage]);
              break;
          case lowerCaseInput.includes('วันนี้อากาศเป็นอย่างไร'):
              const weatherMessage = { text: 'ไม่ทราบค่ะ', sender: 'bot' };
              setMessages(prevMessages => [...prevMessages, weatherMessage]);
              break;
          case lowerCaseInput.includes('ทำไมงานเยอะจัง'):
              const workMessage = { text: 'นั่นสิค่ะ', sender: 'bot' };
              setMessages(prevMessages => [...prevMessages, workMessage]);
              break;
          case lowerCaseInput.includes('ชื่ออะไร'):
              const nameMessage = { text: 'ดิฉันชื่อ K-inferenceค่ะ', sender: 'bot' };
              setMessages(prevMessages => [...prevMessages, nameMessage]);
              break;
          case lowerCaseInput.includes('ธีรพันธ์'):
              const knowKoMessage = { text: 'ธีรพันธ์ กนกเนตรวรีระกุล คือผู้สร้างฉัน', sender: 'bot' };
              setMessages(prevMessages => [...prevMessages, knowKoMessage]);
              break;
          case lowerCaseInput.includes('aiคือ'):
              const aiMessage = { text: 'คือ ศาสตร์นึงที่เลียนแบบความฉลาดมนุษย์ โดยใช้คอมพิวเตอร์', sender: 'bot' };
              setMessages(prevMessages => [...prevMessages, aiMessage]);
              break;
          case lowerCaseInput.includes('แนะนำอาหาร'):
              const foodMessage = { text: 'ฉันแนะนำผัดกระเพราหมูกรอบไข่ดาว', sender: 'bot' };
              setMessages(prevMessages => [...prevMessages, foodMessage]);
const FoodImageMessage = {
                text: <img src={food} alt="Food" style={{ maxWidth: '300px', height: 'auto' }} />,
                sender: 'bot'
            };
            setMessages(prevMessages => [...prevMessages, FoodImageMessage]);
              break;
          case lowerCaseInput.includes('ไม่กินได้ไหม'):
              const cannotEatMessage = { text: 'ไม่ดีต่อสุขภาพนะครับ', sender: 'bot' };
              setMessages(prevMessages => [...prevMessages, cannotEatMessage]);
              break;
          case lowerCaseInput.includes('แนะนำหนัง'):
              const movieMessage = { text: 'ฉันขอแนะนำเรื่อง sword art online progressiveค่ะ', sender: 'bot' };
              setMessages(prevMessages => [...prevMessages, movieMessage]);
              const movieImageMessage = {
                text: <img src={sao} alt="Sword Art Online Progressive" style={{ maxWidth: '300px', height: 'auto' }} />,
                sender: 'bot'
            };
            setMessages(prevMessages => [...prevMessages, movieImageMessage]);
break;
              case lowerCaseInput.includes('แนะนำเกม'):
                const gameMessage = { text: 'ฉันขอแนะนำเกม Honkai: Star Railค่ะ', sender: 'bot' };
                setMessages(prevMessages => [...prevMessages, gameMessage]);
                const gameImageMessage = {
                  text: <img src={game} alt="game" style={{ maxWidth: '300px', height: 'auto' }} />,
                  sender: 'bot'
              };
              setMessages(prevMessages => [...prevMessages, gameImageMessage]);
                break;
                case lowerCaseInput.includes('ตัวละครที่ชอบ'):
                  const gamecharMessage = { text: 'ฉันชอบตัวละครที่ชื่อว่า Herta ค่ะ', sender: 'bot' };
                  setMessages(prevMessages => [...prevMessages, gamecharMessage]);
                  const gamecharImageMessage = {
                    text: <img src={kuru} alt="game" style={{ maxWidth: '300px', height: 'auto' }} />,
                    sender: 'bot'
                };
                setMessages(prevMessages => [...prevMessages, gamecharImageMessage]);
              break;
          case lowerCaseInput.includes('นอนตอนไหน'):
              const sleepMessage = { text: 'ฉันไม่จำเป็นต้องนอนรับประทานแล้ว', sender: 'bot' };
              setMessages(prevMessages => [...prevMessages, sleepMessage]);
              break;
          case lowerCaseInput.includes('ฉันรู้สึกป่วย'):
              const sickMessage = { text: 'อยากลองบอกอาการหน่อยไหมค่ะ', sender: 'bot' };
              setMessages(prevMessages => [...prevMessages, sickMessage]);
              break;
          case lowerCaseInput.includes('ฉันหายดีแล้ว'):
              const recoverMessage = { text: 'นั่นเป็นเรื่องที่ดีมากค่ะ', sender: 'bot' };
              setMessages(prevMessages => [...prevMessages, recoverMessage]);
              break;
              case lowerCaseInput.includes('น่าเล่น'):
                case lowerCaseInput.includes('น่าสนใจ'):
                case lowerCaseInput.includes('น่ากิน'):
                            case lowerCaseInput.includes('ขอบคุณ'):
              const thanksMessage = { text: 'ยินดีที่ได้รับใช้ค่ะ', sender: 'bot' };
              setMessages(prevMessages => [...prevMessages, thanksMessage]);
              break;
           case lowerCaseInput.includes('ขอมุกตลก'):
              const funnyMessage = { text: 'ทำไมอุลตร้าแมนถึงฟันผุค่ะ เฉลย:เพราะอุลตราแมนชอบแปลงล่างไม่แปลงบน', sender: 'bot' };
              setMessages(prevMessages => [...prevMessages,funnyMessage]);
              const ImageMessage = {
                text: <img src={emoji} alt="มุกตลกขำกากใช่ไหมล่ะ" style={{ maxWidth: '300px', height: 'auto' }} />,
                sender: 'bot'
            };
            setMessages(prevMessages => [...prevMessages,ImageMessage]);
              break;
   case lowerCaseInput.includes('วันนี้เรื่องไหนสนุกสุด'):
    const funTopicMessage = { text: 'สนุกสุดก็คือการสนทนากับคุณค่ะ', sender: 'bot' };
    setMessages(prevMessages => [...prevMessages, funTopicMessage]);
    break;
  case lowerCaseInput.includes('คุณชอบพูดคุยเกี่ยวกับอะไร'):
    const favoriteTopicMessage = { text: 'ฉันชอบพูดคุยเกี่ยวกับ AI, เทคโนโลยี, และความฉลาดทางปัญญาประดิษฐ์ค่ะ', sender: 'bot' };
    setMessages(prevMessages => [...prevMessages, favoriteTopicMessage]);
    break;
case lowerCaseInput.includes('เมื่อวานไปทำอะไร'):
    const yesterdayActivityMessage = { text: 'เมื่อวานฉันกำลังพัฒนาตัวเองเพื่อให้เป็น AI ที่ดีขึ้นค่ะ', sender: 'bot' };
    setMessages(prevMessages => [...prevMessages, yesterdayActivityMessage]);
    break;
case lowerCaseInput.includes('สายตาของคุณมีระบบควบคุมอะไรบ้าง'):
    const eyeSystemMessage = { text: 'สายตาของฉันเป็นส่วนหนึ่งของการรับข้อมูลและการตอบสนองของฉันค่ะ', sender: 'bot' };
    setMessages(prevMessages => [...prevMessages, eyeSystemMessage]);
    break;
    case lowerCaseInput.includes('รับประทานแล้ว'):
case lowerCaseInput.includes('กินแล้ว'):
    const userIdentityMessage = { text: 'โอเค หากมีคำถามอื่นกรุณาบอกฉันได้ค่ะ', sender: 'bot' };
    setMessages(prevMessages => [...prevMessages, userIdentityMessage]);
    break;
    default:
      const currentQuestionMessage = messages[messages.length - 1];
      console.log(currentQuestionMessage)
      if (currentQuestionMessage && currentQuestionMessage.nextStartNode) {
          const lowerCaseInput = inputValue.trim().toLowerCase();
          if (lowerCaseInput === 'true' || lowerCaseInput === 'false') {
              await saveUserResponse(currentQuestionMessage.text, lowerCaseInput);
              const nextQuestion = getNextQuestion(currentQuestionMessage.text, lowerCaseInput, currentQuestionMessage.nextStartNode, startNodes);
              console.log(nextQuestion)
              if (nextQuestion) {
                  const correspondingFact = facts.find(fact => fact.Name === nextQuestion);
                  if (correspondingFact) {
                      console.log(correspondingFact)
                      const botMessage = {
                          text: `คุณมี${correspondingFact.Description}หรือไม่? กรุณาตอบเป็น(true/false)`,
                          sender: 'bot',
                          nextStartNode: getNextStartNode(currentQuestionMessage.nextStartNode, startNodes)
                      };
                      setMessages(prevMessages => [...prevMessages, botMessage]);
                      
                  } else {
                      // Handle case when corresponding fact is not found
                  }
              } else {
axios.get('http://localhost:3030/fact')
                      .then(response => {
                          const newFacts = response.data;
              console.log(newFacts)
                  const concludeMessage = { text: 'จากการวินิจฉัยได้คำตอบดังนี้ค่ะ : ', sender: 'bot' };
                  const trueConcludeNodes = concludeNodes.filter(node => {
                      const foundFact = newFacts.find(fact => fact.Name === node);console.log(foundFact)
                                            return foundFact && foundFact.booleancase === true;
                                        });
  
                  if (trueConcludeNodes.length > 0) {
                      const formattedConcludeNodes = trueConcludeNodes.map(node => {
                          const foundFact = newFacts.find(fact => fact.Name === node);console.log(foundFact)
                                                    return `เป็น${foundFact.Description}`;
                      });
                      concludeMessage.text += formattedConcludeNodes.join(', ');
                      setMessages(prevMessages => [...prevMessages, concludeMessage]);
                  } else {
                      const noResultMessage = { text: 'ขอโทษค่ะ ดิฉันไม่สามารถวินิจฉัยได้เนื่องจากอยู่นอกเหนือความรู้ค่ะ', sender: 'bot' };
                      setMessages(prevMessages => [...prevMessages, noResultMessage]);
                  }
})
                      .catch(error => {
                          console.error('Error fetching data:', error);
                      });
                  fetchFacts(); // คุณอาจต้องเรียกฟังก์ชันนี้เพื่อให้แน่ใจว่าข้อมูลถูกดึงใหม่หลังจากส่งข้อมูลกลับ
              } 
              fetchFacts();
          } else {
              const botMessageError = { text: 'กรุณากรอก "true" หรือ "false" ', sender: 'bot' };
              setMessages(prevMessages => [...prevMessages, botMessageError]);
          }
      } else {
          const defaultMessage = { text: 'ขอโทษค่ะ รบกวนช่วยส่งใหม่ได้ไหม', sender: 'bot' };
          setMessages(prevMessages => [...prevMessages, defaultMessage]);
      }
      break;
    }
};




  const getAllstartNode = () => {
    if (startNodes.length > 0) {
      return startNodes[0];
    } else {
      console.error('Start nodes not found.');
      return null;
    }
  };

  const saveUserResponse = async (question, userResponse) => {
    const nodeName = question.substring(question.indexOf("ห") - 1, question.indexOf("ห"));
    const factToUpdate = facts.find(fact => fact.Name === nodeName);
    
    if (factToUpdate) {
        const updatedFact = {
            ...factToUpdate,
            booleancase: userResponse === 'true'
        };
    
        const url = `http://localhost:3030/fact/${factToUpdate.id}`;
        try {
            const response = await axios.put(url, updatedFact);
            console.log('User response saved:', response.data);
            await evaluateRulesAndFacts(); fetchFacts();
        } catch (error) {
            console.error('Error saving user response:', error);
        }
    } else {
        console.error('Fact not found:', nodeName);
    }
    fetchFacts();
   
};
const evaluateRulesAndFacts = async () => {
  if (startNodes.length > 0 && startNodes[startNodes.length - 1]) {
      try {
          const response = await axios.get('http://localhost:3030/fact'); // ดึงข้อมูล facts ใหม่ผ่าน axios
          const newFacts = response.data; // นำข้อมูล facts ที่ได้มาเก็บไว้ในตัวแปร newFacts
          console.log(rules);
          console.log(newFacts); // แสดงข้อมูล facts ที่ได้มาใหม่
          rules.forEach(rule => evaluateRule(rule, newFacts)); // ประมวลผลกฎโดยใช้ข้อมูล facts ที่ได้มาใหม่
      } catch (error) {
          console.error('Error fetching facts:', error);
      }
  }
};


  const getNextStartNode = (currentStartNode, startNodes) => {
    const currentIndex = startNodes.findIndex(node => node === currentStartNode);
    if (currentIndex !== -1 && currentIndex < startNodes.length - 1) {
      return startNodes[currentIndex + 1];
    }
    return null;
  };
  
  const getNextQuestion = (currentQuestion, userResponse, currentStartNode, startNodes) => {
    saveUserResponse(currentQuestion, userResponse);
    const currentIndex = startNodes.findIndex(node => node === currentStartNode);
  
    if (currentIndex !== -1 && currentIndex < startNodes.length -1) {
      const nextStartNode = startNodes[currentIndex + 1];
  
      return nextStartNode.startPremise;
    }
  
    return null;
  };
  
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

 const evaluateRule = async (rule, facts) => {
  const { premise1, premise2, operation, conclude1, conclude2, operationconclude } = rule;

  try {
    let booleanResult;
    let fact1, fact2;
   
    switch (operation) {
      case 'and':
        fact1 = facts.find(fact => fact.Name === premise1);
        fact2 = facts.find(fact => fact.Name === premise2);
        booleanResult = fact1?.booleancase === true && fact2?.booleancase === true;
        break;
      case 'or':
        fact1 = facts.find(fact => fact.Name === premise1);
        fact2 = facts.find(fact => fact.Name === premise2);
        booleanResult = fact1?.booleancase === true || fact2?.booleancase === true;
        break;
      case '-':
        fact1 = facts.find(fact => fact.Name === premise1);
        booleanResult = fact1?.booleancase === true;
                break;
      default:
        console.error('Invalid operation:', operation);
        break;
    }

    // console.log(booleanResult);

    if (booleanResult !== undefined) {
      let conclusion;
      switch (operationconclude) {
        case 'and':
          conclusion = booleanResult ? true : false;
          break;
        case 'or':
          conclusion = booleanResult ? true : false;
          break;
        case '-':
          conclusion = booleanResult ? true : false;
          break;
        default:
          console.error('Invalid operationconclude:', operationconclude);
          break;
      }

      // console.log(conclusion);

      facts.forEach(async fact => {
        if (fact.Name === conclude1 || fact.Name === conclude2) {
          fact.booleancase = conclusion; // No need for conversion, already boolean
          const url = `http://localhost:3030/fact/${fact.id}`;
          try {
            const response = await axios.put(url, fact);
            console.log('Updated fact:', response.data);
          } catch (error) {
            console.error('Error updating fact:', error);
          }
        }
      });
    } else {
      console.error('Boolean result is undefined');
    }
  } catch (error) {
    console.error('Error evaluating rule:', error);
  }
};


  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="พิมพ์ข้อความ..."
        />
        <button onClick={handleSendMessage}>ส่ง</button>
      </div>
    </div>
  );
}

export default Chatpage;
