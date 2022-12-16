import { Button } from "../../../../components/Button";
import { TitleText } from "../../../../components/Typography";
import { useCart } from "../../../../hooks/useCart";
import { CoffeeCartCard } from "../CoffeeCartCard";
import { ConfirmationSection } from "./ConfirmationSection";
import { DetailsContainer, SelectedCoffeesContainer } from "./styles";

export function SelectedCoffes() {
  const { cartItens } = useCart()
  return (
    <SelectedCoffeesContainer>
      <TitleText size="xs" color="subtitle">
        Cafés selecionados
      </TitleText>

      <DetailsContainer>
        {cartItens.map((item) => (
          <CoffeeCartCard key={item.id} coffee={item} />
        ))}
        
        <ConfirmationSection />
      </DetailsContainer>
    </SelectedCoffeesContainer>
  )
}