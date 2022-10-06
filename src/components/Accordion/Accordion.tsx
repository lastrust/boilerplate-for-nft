import { FC, useState } from "react";
import DownArrow from "assets/svgs/down-arrow.svg";
import "./AccordionItem.css";

type Props = {
  title: string;
  content: string;
};

export const AccordionItem: FC<Props> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion-item">
      <div className="accordion-header">
        <div>{title}</div>

        {isOpen ? (
          <button className="accordion-button" onClick={() => setIsOpen(false)}>
            <img src={DownArrow} alt="close accordion" className="up-arrow" />
          </button>
        ) : (
          <button className="accordion-button" onClick={() => setIsOpen(true)}>
            <img src={DownArrow} alt="open accordion" />
          </button>
        )}
      </div>

      {isOpen && <div className="content">{content}</div>}
    </div>
  );
};
