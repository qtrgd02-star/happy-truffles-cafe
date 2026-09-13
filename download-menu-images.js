const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const dir = path.join(__dirname, "public", "menu");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const imageUrls = [
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/ab9f22c5-29b3-4c4f-823c-26d8b99db369.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/3a643feb-943e-40e5-ad62-7e8f6c88a1c1.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/156325b8-1b2b-416e-a767-0d39d52ea224.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/f4a39034-7ca2-429b-8433-62c6aa096892.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/157dd11f-d5e0-45b6-b411-2dfcd45715f6.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/2798345396/3be279c7-56d7-4afe-9a8a-6348aa7338ba.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/3374747287/9c538c92-5136-4513-9e0a-48ec4aaa4de0.jpg?width=400&height=400",
  "https://talabat.dhmedia.io/image/global-menu-service/TB_QA/vendor/793686/product/f8de9914-7e76-43d3-8bde-6512bb427ac7.jpg?width=400&height=400",
  "https://talabat.dhmedia.io/image/global-menu-service/TB_QA/vendor/793686/product/c09789f1-8d7a-4bae-82ef-2b0a28cec69d.jpg?width=400&height=400",
  "https://talabat.dhmedia.io/image/global-menu-service/TB_QA/vendor/793686/product/356cf1f9-0582-4166-a40f-f23dcfd90469.jpg?width=400&height=400",
  "https://talabat.dhmedia.io/image/global-menu-service/TB_QA/vendor/793686/product/019a584c-33a6-49b2-9c93-64e4a4804616.jpg?width=400&height=400",
  "https://talabat.dhmedia.io/image/global-menu-service/TB_QA/vendor/793686/product/2518b6c0-ff67-4a4b-8a55-01db0f70df07.jpg?width=400&height=400",
  "https://talabat.dhmedia.io/image/global-menu-service/TB_QA/vendor/793686/product/c09ec464-e981-4482-b7bc-ad933cda3f52.jpg?width=400&height=400",
  "https://talabat.dhmedia.io/image/global-menu-service/TB_QA/vendor/793686/product/fe50cbd6-96bd-4bad-8147-a3d9d4629efa.jpg?width=400&height=400",
  "https://talabat.dhmedia.io/image/global-menu-service/TB_QA/vendor/793686/product/b3c2bb2b-88be-45f1-86ed-8bd7b7e1234d.jpg?width=400&height=400",
  "https://talabat.dhmedia.io/image/global-menu-service/TB_QA/vendor/793686/product/7baa8d9f-4f43-4d73-9b16-e517dc11d6a8.jpg?width=400&height=400",
  "https://talabat.dhmedia.io/image/global-menu-service/TB_QA/vendor/793686/product/0d78de6f-776e-46df-abe9-49dfaf86dff9.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/f1a4150c-5f0e-4e44-9c48-024e3b1c9928.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/3a8082a8-dca6-4e11-af2c-9fc84995051c.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/6ef7bead-93e6-46af-9a3c-3e5f8675f0c2.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/9a2dc001-924e-41b8-aa6b-8e24e0a8f0bb.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/3f634b0f-2ec1-477f-8ff7-5400cdcbfbd1.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/411e920e-3698-4604-91a0-33e9fb00f6a7.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/cab50a09-45da-412e-88e0-3f916db0cd07.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/bc1e12fd-9cb5-4dc4-8e8e-67b4c1f160de.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/9842f4d4-3243-4a8a-b969-112da3d37696.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/4b44e831-ba15-4d46-8888-513e7231c65d.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/de7bc295-ba42-481c-a5f4-8bc8983bffc9.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/1bbe57d5-3b45-49bb-a4dd-dce7ed165cad.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/969e7c8d-3b95-4d8b-87c6-f61d2ccae290.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/2c21d099-053f-4150-9869-92d511da0cb4.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/c6f55e9f-7050-4889-bd0d-29fdd078e944.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/c60c633b-7b75-41a6-ad59-bd3a367d668f.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/195e90dd-96da-4852-a463-ba0b667b8a20.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/2942905f-a4ef-40a5-bf72-0cdb9c7f8a70.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/18e11b95-7791-4a59-92d2-bb30b9afc0f1.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/0d170c98-7b81-4b15-ba53-e1b9a669e793.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/b0581560-9430-4cd6-9139-c2c886053dc9.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/2eef1dd4-35aa-4f5e-a5d3-0e5999a25c3f.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/a000f68a-eb59-4cd6-8030-383264264db6.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/22d3931b-a4c8-47d1-8eeb-9368df678de6.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/3176d89b-a958-4b0f-a919-2d6148a23602.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/3dbb9d2a-dd74-46ad-824d-bb4027be3ea5.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/00e33094-53fb-4b67-9f6d-835a240128bb.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/096a5ddd-eed9-471a-af2b-f33aa6030238.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/3c3bb514-fb46-4973-9e8a-dec6020274cd.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/69a898fa-6463-43de-82a9-51c7b40b0de3.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/6087adf5-87a9-4317-be6f-f9803ba9ae78.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/56e39e0d-ceb5-4dad-abe6-ee811e3ddc8c.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/a5a78dc7-5302-45ff-9ce2-2579763f35ea.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/2452f63b-5442-43bf-ac9d-f1cfd8ffe725.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/44ed8766-df7c-4d23-b717-a9f219a075a6.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/9ba50c6a-99d8-4c88-af7a-cd8c6e3f6bfa.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/a4666da2-c0be-41a9-b9ed-18e98d3b072a.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/30f9991b-3948-412e-8b1b-509a1cb9d905.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/489088dd-1001-4d43-a826-66fdbafe69de.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/62718b9e-5bf5-4f73-8757-76a8cfa7c3ad.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/b5ec315d-3844-456b-92dc-44d62bfe7128.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/12876f08-86b6-4136-9b13-c4d150d0c4b0.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/2f7d9ace-a7ba-45c7-8fd8-3d6b9ae8220e.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/fe42ac14-4a61-49da-a2ee-2eb1194fb7e0.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/885c8ccc-3590-47d9-ab9e-73c66ad4b0e5.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/9aa0ff2e-c452-4de9-910d-d79c4709b714.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/f2917779-cdeb-476a-99cc-5872127dbcf7.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/43c9ab60-23ce-4932-9f73-9bdc165b0323.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/4d2de29d-7e60-4109-ba12-de0670b82348.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/7a8016e0-ff24-477a-966c-c0b5c6996ef9.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/a50c3844-3644-4657-8803-6553c35e4782.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/0729ab96-6d9f-4833-8a67-9f5f9ac74555.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/3f5e021d-8251-499b-8d1a-4240c66eb571.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/af46af98-011a-414c-8bcc-3fc9907434f5.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/dc5a3cb6-2630-4c4b-b354-04cf3fb0ba4f.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/84e397c3-ca80-455f-b083-29b01fb65bb9.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/f1ca03a7-f8fe-40e9-b3a4-589b6eca1cd8.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/4438cfdd-3af8-4dda-b76d-d85dd5fe33e3.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/2fd2d82c-f252-48e5-b4da-77888b0cf00f.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/78246987-3e21-4223-a99b-f4bc9734e9f9.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/b83edc35-1baa-4768-a430-5b943d685138.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/14438fa8-4c03-4b44-8c00-9d5f9dc69368.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/3b488198-7df5-4081-ac25-e36b9cef8d15.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/8d2678d8-796e-4a8d-ba84-920eb43f7cbe.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/2813999313/363f4bda-b3c5-402a-af72-6f0d8baf0860.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/86b337a0-9f4b-462f-b19d-8768d9a06a0f.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/41ea8e38-3640-4f8a-959d-bbbde38e5d7e.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/466614b5-3e60-4680-b9f7-8ba04bf5e98f.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/2a510f7b-de29-4273-9b88-e3e14a9335df.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/1e4cd073-9c64-4e1f-9ef6-e20cf1d841eb.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/0e6a3741-07d7-48aa-8e24-d224a1c4d90f.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/067e14fb-15b5-4f97-88f2-899dc48152df.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/2827209942/244bed75-028d-4eb3-b613-01effe8c409e.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/8a1b6132-d64e-4e7a-8ad1-47c473a248d0.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/bd041db5-5947-463e-b1f9-8c43cf2a7b2a.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/c24aba00-8a5c-4d38-b3f4-ad1a8c1925f2.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/2876805485/2905ec59-29ff-4c61-9e32-048177776ae7.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/189debe2-7a9e-4f75-b579-06d11926f221.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/1dd0f192-268b-4308-9117-0c19db57c9bb.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/af16ef55-d4db-4736-b907-64b4c88a42d3.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/0b60357b-e5c9-4031-a19b-0568472f0b17.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/b92dd8f7-41b7-4e67-9525-708299f515cb.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/af8c7970-fe0e-4da0-bb48-79c5a2882ca7.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/bb043e0b-c3d7-4fc0-ae50-b097debab097.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/482f03ea-c7c2-440d-9a9a-bf8e103faf2c.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/5bdcb965-dded-4b9e-b378-2d662c36092e.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/bb49a1dd-e397-46d6-bb35-085ae1b26db0.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/4abfad03-9aa9-439a-a36d-241f2879208e.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/db86afd6-40b0-40a4-9751-6aa6bc754dda.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/d6f077ad-22bd-4dfc-a920-c6688783a2f4.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/3151505038/1fd5f8d4-d417-4915-bbd0-d34a2e3955b4.jpg?width=400&height=400",
  "https://talabat.dhmedia.io/image/global-menu-service/TB_QA/vendor/793686/product/3151509937/445c9279-1030-4df2-b41b-be581bd435d0.jpg?width=400&height=400",
  "https://talabat.dhmedia.io/image/global-menu-service/TB_QA/vendor/793686/product/3151514941/654f639d-e6e6-425b-b570-03a43d695d68.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/3214243721/08684439-2d9f-437d-9d0c-b1b0722c8dc8.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/3214244032/3fe869ee-e13f-4fc2-a588-864215139016.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/d2aa8e41-b5e2-4275-bcb0-c0d56e1b5c8b.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/3b872159-9716-47a6-b33b-f2dc428744dc.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/23fc35c1-97db-402c-a940-9ba33e246f3a.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/091d03f7-ef46-4d3c-aba4-c983aa901eb7.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/2072d67d-376a-4af7-8c1e-1cccf50af5ac.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/9bc5ac48-019f-40b9-85e2-f48157e34d8f.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/5ef24e3d-900b-4b88-90b9-64d2b74ef3d0.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/34d73dad-47f9-4557-b624-e0ca044514e9.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/2793654343/4530b5cd-221a-4d0f-8fb0-45b73587f851.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/ec0ce638-600f-4087-81a4-2d00155a7c15.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/50b0eb9e-9f0e-4f37-99b2-3dbf478c9c43.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/0af7a590-1d5c-4765-8a3d-00ea284235f5.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/53eefce3-ca0e-401c-948a-fcba37543b04.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/2793721596/770aea16-e422-4dfd-93eb-ad68498ebd49.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/5888dee7-30d9-4f06-982e-bf7dad6d4068.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/679b98d8-8188-4170-bd68-bd06141a6ef2.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/d89958f9-53dd-4d62-a498-6297d7e4558a.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/c307e098-7a1d-4bbf-a6e3-84ae83bd871c.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/d344875a-74bc-43ad-8907-38898087efb2.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/bbf8f6e7-fd63-4bdf-8d88-aadad5b0073b.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/12e1e7c9-ec63-45bb-90f4-cb96dff04dc9.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/757a867e-8f25-422a-ae84-d6ff03d9a933.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/d7865710-e655-4fbe-8032-dc6511e12cb8.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/f2426cb9-f9d5-4089-a92b-c30983801da9.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/e5a39ea6-e18d-4c46-8df7-7053bd19b1eb.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/93475d8d-48d6-4f64-b029-acd9cbd38e51.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/370432f6-4191-4fa5-aa99-5faf49e1083f.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/e62d0c76-efd2-4e2a-b858-a05afbde1764.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/b9998372-c0da-4f89-9aed-f6b5f24d84c5.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/78c5ed46-3128-4819-ada2-17e5f78295fe.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/b74bbbbe-55ae-4585-acde-e83402859205.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/70e84274-392c-4631-acbb-14d08526292f.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/219d126f-616f-4185-94ac-404bb08da3de.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/5a9143cc-b3f1-47ab-8520-d80a17586042.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/2756930240/697a07fa-a2de-4d37-9c8b-102b09bdb3a3.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/2756930241/d072799c-b4b7-479b-ae85-149a700632bb.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/2756930243/63725e43-2418-41ca-8a58-36cf0510e988.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/12379b81-c455-407f-934b-78a4308ab081.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/bbc5c460-3e6c-4b03-a9fd-2042275423d9.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/aec5de6f-67c4-456c-a013-6b16c49b6380.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/8a154843-6b9e-4afa-8a3d-b2cacac0f071.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/56141218-5f6f-4adc-9209-7f04cd3ae6c5.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/08a44ee0-8c7d-42e9-9604-08185819d234.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/33292274-291c-4ebb-ad2d-292eb6909279.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/28373f08-8cad-4dba-ba7a-e9f9ebe9b701.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/2abff94e-7c6f-46f9-97fb-1497fa668489.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/16e4381a-28ac-4697-bf9b-f23727434110.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/5d1bfa86-c5a1-4e2c-9982-1444c8914dde.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/fc24519c-9f4a-4a1c-8498-355249477440.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/3864e9f0-c5d5-44a9-8d9f-6db90b67359c.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/7675a01d-9b4c-4b76-84ce-da8b056f458f.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/68625c9f-e777-4ebc-bebe-682a285e8582.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/e378c503-6f79-42b6-b1e6-3bbb5650cdd0.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/2581d2e5-a483-4fa6-a50d-3c38ad3df035.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/a85066cc-5e2e-4057-a2a5-2bd25f0e44b4.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/3abce3cd-0c55-4931-a3dc-0f4d8e5dc92f.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/1cac66a9-a00f-4419-bfd3-ecb499e86683.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/c79d971b-de06-40c3-ad68-46916f39bcfe.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/0f37a07e-6fcc-4b15-919a-e27a88eec87f.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/467a2770-58b4-4cbb-be3d-573c7b3af4cf.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/81180a1d-0d14-4a64-8a71-937c31365780.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/934611f7-5605-4c5d-ae85-1800a452d31b.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/0ab7d32d-f07d-44bd-8acf-082ff01a41ee.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/70105eb5-f4bc-4270-9d4f-8b91afac7f01.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/talabat/MenuItems/Iced_Flatwhite639059131446477065.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/talabat/MenuItems/Iced_Cappucino639059131442998829.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/talabat/MenuItems/Iced_Caramel_Latte639059131446458602.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/talabat/MenuItems/Iced_Salted_Caramel_Latte639059131446463197.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/talabat/MenuItems/Iced_V60639059131456062435.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/talabat/MenuItems/Iced_Hazelnut_Latte639059131447474226.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/talabat/MenuItems/Iced_Toffeenut_Latte639059131446468789.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/talabat/MenuItems/Iced_Spanish_Latte639059131446495556.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/0dd1ba7e-a1d5-4959-a976-94b9848dafb5.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/a74eeac8-03ae-4908-9faa-8bf0d73e356a.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/c65812cc-fe42-44cb-8395-d6c5c6e15f41.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/7cd9f145-98a5-4941-a990-b947fc677a27.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/39c80cfe-5db9-49b2-a423-c870d9e37296.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/ffcfc66b-db8d-4b1c-906a-e48af18018c5.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/256205c6-1401-4e17-94f7-38d894e6e957.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/e9466785-aa4f-41f5-8a71-e12325354e3b.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/b9e3e6ac-882b-4115-9736-066d616f7d36.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/0831ca98-a418-4ef5-9fcf-acd9ebf4ddae.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/274535b9-284d-4301-8600-2e2158ca50a5.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/0244a041-bbb1-4d0d-ba1c-b76352c11e10.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/6878dd5e-38db-4d3f-9a64-dfb0d6559aeb.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/a03ba0ad-4dce-40e9-8eef-acb3931d2383.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/7e89ae38-fe36-4979-b327-ce3d1fc529d5.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/e48635de-fe1b-4334-980d-5ddaef20ba9d.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/476bb4d4-0002-4185-a5bf-2bdc891bc872.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/c9a96747-3377-4924-b57a-32e28f64c715.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/349af0e1-ab95-4d3b-99be-33103c3eb569.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/4b502d4b-ed33-4402-a0ac-bb32ade93e9a.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/e46d04d2-4be8-48c7-b3ad-d9acf575904f.jpg?width=400&height=400",
  "https://talabat.dhmedia.io/image/global-menu-service/TB_QA/vendor/793686/product/79db95e5-e7d1-4d5a-9c30-deabc7b485ac.jpg?width=400&height=400",
  "https://talabat.dhmedia.io/image/global-menu-service/TB_QA/vendor/793686/product/73839c33-e8be-473c-a3e9-68b1f077054a.jpg?width=400&height=400",
  "https://talabat.dhmedia.io/image/global-menu-service/TB_QA/vendor/793686/product/7f2bbe2a-c945-46d8-b70c-29b51a0f654d.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/b170a801-3c9d-4c90-a640-884950d9501a.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/bc419c71-a032-43ea-a813-1108ab3c0d39.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/788384b7-24cd-488c-8efa-3b8a7aaec049.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/4048a918-5c5b-4354-adcb-d1f260a07f20.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/d6df26cc-d6a8-40a4-9471-2ede5794ee7d.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/f5a05c04-9e5a-486c-9695-56c95fab75cf.jpg?width=400&height=400",
  "https://talabat.dhmedia.io/image/global-menu-service/TB_QA/vendor/793686/product/719c794c-bec2-495b-884a-35e5ffb1abd6.jpg?width=400&height=400",
  "https://talabat.dhmedia.io/image/global-menu-service/TB_QA/vendor/793686/product/577d808c-edd6-4255-ac4a-394441eafbcd.jpg?width=400&height=400",
  "https://talabat.dhmedia.io/image/global-menu-service/TB_QA/vendor/793686/product/331548f0-97ed-4901-abe6-997928cda175.jpg?width=400&height=400",
  "https://talabat.dhmedia.io/image/global-menu-service/TB_QA/vendor/793686/product/7cdf76a4-4677-47d0-b00a-7a946f4cbedb.jpg?width=400&height=400",
  "https://talabat.dhmedia.io/image/global-menu-service/TB_QA/vendor/793686/product/6b3d65eb-7533-4b0b-bacd-7c290f2455cc.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/c38a28a5-34e3-4728-88ba-f0b250a27a49.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/52f93aa3-439f-460e-94fe-2246a6600f06.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/2ff300cf-004b-46f7-a036-73bc78674a1b.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/7d3952f6-c7c4-412c-a870-dd422a60f2b8.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/bb14a02a-a7bb-4d5c-858d-021c26e41b11.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/77da0b0c-8b87-438a-a4b1-df116b626c57.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/c3127fd8-9069-42b9-b062-e59a5612ee1f.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/444bb38b-f9ee-402e-93a2-9d62c87b5f14.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/1f09e6d2-6ad5-4c52-9260-37e43f9d4b32.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/f6fc7005-5e64-4328-b1f6-a8390c36df62.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/eecb3d5e-68fa-4582-928f-f557cd9d9b67.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/72abedc2-e861-450a-b2a2-7f663ecc5fec.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/1a195288-85c7-453b-ab17-45816e925e2f.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/d2543e59-7911-4432-b12a-1b696ef92f2a.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/07529ab0-b256-4b1a-b149-88857363c0fd.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/86f1f427-9512-4502-931c-89ab60e4de2f.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/4c63d925-b684-44e1-9ef8-9f9a175a819a.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/0628e9df-7c0b-40c8-a11e-35f5e3decdf0.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/72db15d4-bb15-4a3c-9158-c69022484d96.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/global-menu-service/TB_QA/vendor/793686/product/f1a0fae7-d177-4086-a35d-95721509260f.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/talabat/MenuItems/Iced_Matcha639059131446411179.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/talabat/MenuItems/Ube_Cheesecake_Latte639059131434737124.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/talabat/MenuItems/3pcs_Mix_Happy_Treats_2639059131446435558.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/talabat/MenuItems/3pcs_Mix_Happy_Treats639059131446434671.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/talabat/MenuItems/3pcs_Mix_Treats_2639059131446466034.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/talabat/MenuItems/3pcs_Mix_Treats639059131457013070.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/talabat/MenuItems/6pcs_Mix_Treats639059131457981159.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/talabat/MenuItems/12pcs_Mix_Happy_Treats639059131459565676.jpg?width=400&height=400",
  "https://images.deliveryhero.io/image/talabat/MenuItems/12pcs_Mix_Treats639059131459029959.jpg?width=400&height=400"
];

const unique = [...new Set(imageUrls)];
console.log("Unique images to download:", unique.length);

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    const req = protocol.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve(dest);
      });
    });
    req.on("error", reject);
    req.setTimeout(60000, () => {
      req.destroy();
      reject(new Error("timeout"));
    });
  });
}

(async () => {
  let ok = 0;
  let fail = 0;
  for (let i = 0; i < unique.length; i++) {
    const u = unique[i];
    const parsed = url.parse(u);
    const base = path.basename(parsed.pathname);
    const ext = path.extname(parsed.pathname) || ".jpg";
    const file = path.join(dir, `menu-${String(i + 1).padStart(3, "0")}${ext}`);
    try {
      await download(u, file);
      process.stdout.write(`OK ${i + 1}/${unique.length}\n`);
      ok++;
    } catch (e) {
      process.stdout.write(`FAIL ${i + 1} ${e.message}\n`);
      fail++;
    }
  }
  console.log(`Done. OK=${ok} FAIL=${fail}`);
})();
