/* eslint-disable react-hooks/exhaustive-deps */
import { Modal } from "antd";
import { useEffect } from "react";

// eslint-disable-next-line react/prop-types
const ModalAlert = ({ player }) => {
  const [modal, contextHolder] = Modal.useModal();
  const countDown = () => {
    let secondsToGo = 3;
    const instance = modal.success({
      title: "Partida Finalizada",
      content: `El ${player} ha perdido por tiempo!`,
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
      instance.update({});
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      instance.destroy();
    }, secondsToGo * 1000);
  };

  useEffect(() => {
    player !== null && countDown();
  }, [player]);

  return <>{contextHolder}</>;
};
export default ModalAlert;
