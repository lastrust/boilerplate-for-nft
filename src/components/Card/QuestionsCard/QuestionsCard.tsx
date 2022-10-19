import { FC } from "react";
import { AccordionItem } from "../../Accordion/Accordion";
import "./QuestionsCard.css";

export const Questions: FC = () => {
  return (
    <div className="questions">
      <AccordionItem title="What do you design?" content="answer A" />
      <AccordionItem
        title="Can you do everything for me, including content and copywriting?"
        content="answer A"
      />
      <AccordionItem
        title="How to provide you copy and content for my presentation?"
        content="answer A"
      />
      <AccordionItem
        title="I have a huge presentation of over 50 slides, can you design that?"
        content="answer A"
      />
    </div>
  );
};
