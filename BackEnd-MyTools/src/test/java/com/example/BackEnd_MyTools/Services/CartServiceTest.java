package com.example.BackEnd_MyTools.Services;

import com.example.BackEnd_MyTools.DTO.AddToCartRequest;
import com.example.BackEnd_MyTools.Entitys.Cart;
import com.example.BackEnd_MyTools.Entitys.Product;
import com.example.BackEnd_MyTools.Kafka.KafkaProducerService;
import com.example.BackEnd_MyTools.Repositories.CartRepo;
import com.example.BackEnd_MyTools.Repositories.ProductRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDate;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {
    @Mock
    CartRepo cartRepository;
    @Mock
    ProductRepo productRepository;
    @Mock
    KafkaProducerService kafka;
    @InjectMocks
    CartService cartService;

    @Test
    void addItemCreatesActiveCartAndNormalizesQuantity() {
        Product p = product("P001", true, 850);
        AddToCartRequest r = new AddToCartRequest();
        r.setProductId("P001");
        r.setQuantity(0);
        when(productRepository.findById("P001")).thenReturn(Optional.of(p));
        when(cartRepository.findByUserIdAndStatus("U001", Cart.CartStatus.ACTIVE)).thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class))).thenAnswer(i -> i.getArgument(0));
        Cart cart = cartService.addItem("U001", r);
        assertThat(cart.getStatus()).isEqualTo(Cart.CartStatus.ACTIVE);
        assertThat(cart.getItems()).hasSize(1);
        assertThat(cart.getItems().get(0).getQuantity()).isEqualTo(1);
    }

    @Test
    void addRentalItemRejectsPastStartDate() {
        Product p = product("P002", true, 100);
        AddToCartRequest r = new AddToCartRequest();
        r.setProductId("P002");
        r.setListingType(Cart.CartItem.ListingType.RENT);
        r.setStartDate(LocalDate.now().minusDays(1));
        r.setEndDate(LocalDate.now().plusDays(1));
        when(productRepository.findById("P002")).thenReturn(Optional.of(p));
        assertThatThrownBy(() -> cartService.addItem("U001", r)).isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("past");
    }

    private Product product(String id, boolean a, int price) {
        Product p = new Product();
        p.setId(id);
        p.setName("Demo product");
        p.setIsavailable(a);
        p.setPrice(price);
        return p;
    }
}
