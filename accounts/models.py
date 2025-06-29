# main/models.py

from django.db import models
import secrets, string


class Profile(models.Model):
    user = models.OneToOneField("auth.User", on_delete=models.CASCADE, related_name="profile")
    userID = models.CharField(max_length=10, unique=True, null=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    # cover = models.ImageField(default="cover.jpg")
    status = models.CharField(max_length=100, default="I love MaryJane.")
    # avatar = models.ImageField(default="user.jpg")
    phone = models.CharField(max_length=20, null=True, blank=True)
    time_created = models.DateTimeField(auto_now_add=True)
    is_banned = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username}'s profile"

    def save(self, *args, **kwargs):
        if not self.userID:
            self.userID = "".join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(10))
        super().save(*args, **kwargs)
