---
sidebar_position: 2
title: '使用CLI工具'
description: '使用CLI工具安装、运行和管理ABC User Feedback的指南。'
---

# 使用CLI工具

ABC User Feedback CLI（`auf-cli`）是一个命令行界面工具，旨在简化ABC User Feedback的安装、执行和管理。本文档将指导您使用CLI工具快速、轻松地设置ABC User Feedback。

## CLI工具介绍

`auf-cli`提供以下主要功能：

- 自动设置所需基础设施（MySQL、SMTP、OpenSearch）
- 简化环境变量配置
- 自动化API和Web服务器的启动/停止
- 卷数据清理

该工具的最大优势是，只要安装了Node.js和Docker，就可以通过`npx`直接执行，无需安装额外的依赖项或克隆存储库。

## 前提条件

在使用CLI工具之前，您必须满足以下要求：

- [Node.js v22或更高版本](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/desktop/)

## 基本命令

### 初始化

运行以下命令来设置ABC User Feedback所需的基础设施：

```bash
npx auf-cli init
```

此命令执行以下任务：

1. 创建用于环境变量配置的`config.toml`文件。
2. 如果`config.toml`文件已存在，使用`--force`选项覆盖它。

初始化完成后，将创建一个`config.toml`文件。您可以编辑此文件以根据需要调整环境变量。

### 启动服务器

运行以下命令来启动API和Web服务器：

```bash
npx auf-cli start
```

此命令执行以下任务：

1. 从`config.toml`文件读取环境变量。
2. 生成Docker Compose文件并启动服务。
3. 启动API和Web服务器容器以及所需的基础设施（MySQL、SMTP、OpenSearch如果启用）。

服务器成功启动后，您可以在Web浏览器中导航到`http://localhost:3000`（或配置的URL）来访问ABC User Feedback Web界面。CLI将显示可用的URL，包括：

- Web界面URL
- API URL
- MySQL连接字符串
- OpenSearch URL（如果启用）
- SMTP Web界面（如果使用smtp4dev）

### 停止服务器

运行以下命令来停止API和Web服务器：

```bash
npx auf-cli stop
```

此命令会停止正在运行的API和Web服务器容器以及基础设施容器。存储在卷中的所有数据都将被保留。

### 卷清理

运行以下命令来清理启动期间创建的Docker卷：

```bash
npx auf-cli clean
```

此命令会停止所有容器并删除MySQL、SMTP、OpenSearch等的Docker卷。**警告**：此操作将删除所有数据，因此如果需要备份，请确保预先备份您的数据。

您也可以使用`--images`选项来清理未使用的Docker镜像：

```bash
npx auf-cli clean --images
```

## 配置文件（config.toml）

运行`init`命令时，会在当前目录中创建一个`config.toml`文件。此文件用于配置ABC User Feedback的环境变量。

以下是`config.toml`文件的示例：

```toml
[web]
port = 3000
# api_base_url = "http://localhost:4000"

[api]
port = 4000
jwt_secret = "jwtsecretjwtsecretjwtsecretjwtsecretjwtsecretjwtsecret"

# master_api_key = "MASTER_KEY"
# access_token_expired_time = "10m"
# refresh_token_expired_time = "1h"

# [api.auto_feedback_deletion]
# enabled = true
# period_days = 365

# [api.smtp]
# host = "smtp4dev" # SMTP_HOST
# port = 25 # SMTP_PORT
# sender = "user@feedback.com"
# username=
# password=
# tls=
# ciper_spec=
# opportunitic_tls=

# [api.opensearch]
# enabled = true

[mysql]
port = 13306
```

您可以根据需要编辑此文件以调整环境变量。有关环境变量的详细信息，请参阅[环境变量配置](./04-configuration.md)文档。

## 高级用法

### 更改端口

默认情况下，Web服务器使用端口3000，API服务器使用端口4000。要更改这些端口，请在`config.toml`文件中修改以下设置：

```toml
[web]
port = 8000  # 更改Web服务器端口
api_base_url = "http://localhost:8080"  # API URL也必须更改

[api]
port = 8080  # 更改API服务器端口

[mysql]
port = 13307  # 如果需要，更改MySQL端口
```

### 自定义Docker Compose文件

CLI工具内部生成并使用Docker Compose文件。要查看生成的Docker Compose文件，请在运行`start`命令后检查当前目录中的`docker-compose.yml`文件。

您可以直接修改此文件以应用其他配置，但请注意，当您再次运行`auf-cli start`命令时，更改可能会被覆盖。

## 故障排除

### 常见问题

1. **Docker相关错误**：

   - 确保Docker正在运行。
   - 验证您是否有执行Docker命令的权限。

2. **端口冲突**：

   - 检查端口3000、4000、13306、9200、5080等是否正在被其他应用程序使用。
   - 在`config.toml`文件中更改端口设置。

3. **内存不足**：
   - 增加分配给Docker的内存。
   - OpenSearch至少需要2GB的内存。

## 限制

CLI工具适用于开发和测试环境。对于生产环境，请考虑以下事项：

1. 直接设置和管理环境变量以增强安全性。
2. 使用Kubernetes或Docker Swarm等编排工具实现高可用性和可扩展性。
3. 实施数据持久性和备份策略。

## 下一步

如果您已使用CLI工具成功安装了ABC User Feedback，请继续进行[教程](../03-tutorial.md)以配置系统并添加用户。

有关详细的API和Web服务器配置选项，请参阅[环境变量配置](./04-configuration.md)文档。
