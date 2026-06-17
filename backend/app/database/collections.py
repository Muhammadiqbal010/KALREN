from app.database.mongodb import database

product_collection = database.products
analytics_collection = database.click_analytics
user_collection = database.users
lookbook_collection = database.lookbook
site_settings_collection = database.site_settings

# ✅ SINKRONISASI CENTRAL: Pointer sakral untuk manajemen konten CMS lu Bal
cms_collection = database.cms_contents

inventory_collection = database.inventory