from django.contrib import admin
from .models import Course, Trip, Blog

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'published_date', 'slug')
    list_filter = ('published_date', 'author')
    search_fields = ('title', 'content', 'excerpt')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('published_date',)
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'content', 'excerpt')
        }),
        ('Metadata', {
            'fields': ('author', 'published_date', 'slug', 'image_url')
        }),
    )

admin.site.register(Course)
admin.site.register(Trip)
