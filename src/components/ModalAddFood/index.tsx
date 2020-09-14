import React, { useRef, useCallback } from 'react';
import * as Yup from 'yup';

import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

interface ICreateFoodData {
  name: string;
  image: string;
  price: string;
  description: string;
}

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleAddFood: (food: Omit<IFoodPlate, 'id' | 'available'>) => void;
}

const ModalAddFood: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  handleAddFood,
}) => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback(
    async (data: ICreateFoodData) => {
      // TODO ADD A NEW FOOD AND CLOSE THE MODAL
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('O nome da comida é obrigatório'),
          image: Yup.string().url().required('Informe o link da imagem'),
          price: Yup.number().required('O preço da comida é obrigatório'),
          description: Yup.string().required('Informe uma descrição'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        handleAddFood(data);
        setIsOpen();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const allErrors = err.errors;
          const errors = allErrors.join('\n');

          alert(errors);
        }
      }
    },
    [handleAddFood, setIsOpen],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Novo Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />
        <button type="submit" data-testid="add-food-button">
          <p className="text">Adicionar Prato</p>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalAddFood;
