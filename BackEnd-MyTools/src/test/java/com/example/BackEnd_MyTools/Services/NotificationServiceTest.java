package com.example.BackEnd_MyTools.Services;

import com.example.BackEnd_MyTools.Entitys.Notification;
import com.example.BackEnd_MyTools.Repositories.NotificationRepo;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {
    @Mock
    NotificationRepo notificationRepo;
    @Mock
    ObjectProvider<SimpMessagingTemplate> messagingTemplateProvider;
    @InjectMocks
    NotificationService notificationService;

    @Test
    void createRequiresUserId() {
        assertThatThrownBy(() -> notificationService.create(null, "TYPE", "Title", "Message", "REF"))
                .isInstanceOf(IllegalArgumentException.class).hasMessageContaining("userId");
    }

    @Test
    void markReadRejectsOtherUsersNotification() {
        Notification n = Notification.builder().id("N001").userId("OWNER").read(false).build();
        when(notificationRepo.findById("N001")).thenReturn(Optional.of(n));
        assertThatThrownBy(() -> notificationService.markRead("N001", "OTHER")).isInstanceOf(SecurityException.class);
    }

    @Test
    void markReadUpdatesOwnedNotification() {
        Notification n = Notification.builder().id("N001").userId("U001").read(false).build();
        when(notificationRepo.findById("N001")).thenReturn(Optional.of(n));
        when(notificationRepo.save(any(Notification.class))).thenAnswer(i -> i.getArgument(0));
        assertThat(notificationService.markRead("N001", "U001").isRead()).isTrue();
    }
}
