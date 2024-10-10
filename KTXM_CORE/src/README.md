# Hướng dẫn Cài đặt Swagger UI

## Giới thiệu

Swagger UI là một công cụ mạnh mẽ giúp hiển thị tài liệu API và cho phép thử nghiệm các endpoint. Bài viết này sẽ hướng dẫn bạn cách cài đặt Swagger UI cho dự án Odoo của mình.

## Cài đặt thư viện Flask

Trước tiên, bạn cần cài đặt các thư viện cần thiết cho Flask bằng lệnh sau:

```bash
pip install flask-swagger flask-swagger-ui
```

## Tạo Module (nếu cần)

Nếu bạn chưa có module, bạn có thể tạo một module mới bằng lệnh sau:

```bash
python odoo-bin scaffold <ten_module> <path_module>
```

## Tạo Controller

Tạo module vừa tạo hoặc module của bạn mở file controller.py của bạn và thêm đoạn mã sau:

```python 
import json
import logging
from odoo import http
from odoo.http import request
from flasgger import Swagger

_logger = logging.getLogger(__name__)

class CoSalesDemo(http.Controller):
    swagger = Swagger()
    
    @http.route('/swagger/', type='http', auth='none', methods=['GET'], csrf=False)
    def swagger_spec(self):
        swagger_json = {
            "swagger": "2.0",
            "info": {
                "title": "Odoo API",
                "description": "API documentation with Swagger",
                "version": "1.0"
            },
            "host": "localhost:8069",
            "basePath": "/api/v1",
            "schemes": ["http"],
            "paths": {
                "/example_endpoint": {
                    "get": {
                        "summary": "Lấy ví dụ",
                        "description": "Một ví dụ về endpoint",
                        "produces": ["application/json"],
                        "responses": {
                            "200": {
                                "description": "OK",
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "message": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return request.make_response(json.dumps(swagger_json), headers={'Content-Type': 'application/json'})
    
    @http.route('/swagger/ui/', type='http', auth='public', methods=['GET'], csrf=False)
    def swagger_ui(self):
        return request.render('co_sales_demo.swagger_template', {})
```

## Tạo Template cho Swagger UI

Tạo một file XML cho template (ví dụ: `views.xml`) trong module của bạn và thêm đoạn mã sau:

```xml
<odoo>
    <data>
        <template id="swagger_template" name="Swagger UI">
            <t t-call="web.layout">
                <div class="container">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css" />
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js"></script>
                    <div id="swagger-ui"></div>
                    <script>
                        window.onload = function() {
                            const ui = SwaggerUIBundle({
                                url: '/swagger/',
                                dom_id: '#swagger-ui',
                                presets: [
                                    SwaggerUIStandalonePreset,
                                    SwaggerUIBundle.presets.apis,
                                ],
                                layout: "StandaloneLayout",
                            });
                        }
                    </script>
                </div>
            </t>
        </template>
    </data>
</odoo>
```

## Cập nhật và Khởi động lại Odoo

Sau khi bạn đã thực hiện các thay đổi, hãy cập nhật module của bạn và khởi động lại Odoo bằng lệnh sau:

```bash
./odoo-bin -u your_module_name
```
## Truy cập Swagger UI

Cuối cùng, mở trình duyệt và truy cập vào địa chỉ sau để xem Swagger UI:

```
http://localhost:8069/swagger/ui/
```

---

### Kết luận

Hướng dẫn này sẽ giúp bạn cài đặt thành công Swagger UI cho dự án Odoo của mình. Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại hỏi tui thêm nhé!


