/*deal with login user or worker*/
var url = window.location.href;
sessionStorage.setItem("url", url);
const data_path = (new URL(url)).pathname;
const origin_http =  (new URL(url)).origin;
const params_get = new URLSearchParams((new URL(url)).search);
if(document.querySelector(".site_right .right_head .searching_engi label input")){
	let searching = document.querySelector(".site_right .right_head .searching_engi label input");
	searching.addEventListener("keyup", async function(event){
		if(event.keyCode === 13) {
			event.preventDefault();
			sessionStorage.setItem("search_info", (searching.value));
			if(params_get.has("user") === true){
				if(params_get.has("nv") === true)
				{
					window.location.href = origin_http + `/searching` + `?user=${params_get.get("user")}&nv=${params_get.get("nv")}`;
				}else{
					window.location.href = origin_http + `/searching` + `?user=${params_get.get("user")}`;
				}
			}else window.location.href = origin_http + `/searching`;
		}
	});
}
if(params_get.toString() !== ""){
    if(params_get.has("user") === true){
		if(params_get.has("admin") === true){
			console.log("che do admin");
		}
		else{
			login_img();
			let a_list_left = Array.from(document.querySelectorAll(".left_nav ul li.line_side a"));
			if(params_get.has("nv") === true)
			{
				if(document.querySelector(".list_detail .detail_head a")){
					//list hd
					document.querySelector(".list_detail .detail_head a").setAttribute('href' ,
					(origin_http + document.querySelector(".list_detail .detail_head a").getAttribute('href') +
					`?user=${params_get.get("user")}&nv=${params_get.get("nv")}`));;
				}
				for(let i = 0; i < a_list_left.length; i++)
				{
					if(a_list_left[i].getAttribute('href') !== "/off")
					a_list_left[i].setAttribute('href' , (origin_http + a_list_left[i].getAttribute('href') + `?user=${params_get.get("user")}&nv=${params_get.get("nv")}`));  
					else a_list_left[i].setAttribute('href', "/");
				}
			}else{
				if(document.querySelector(".left_nav ul li.unactive"))
				document.querySelector(".left_nav ul li.unactive").setAttribute('class', "line_side");
				for(let i = 0; i < a_list_left.length; i++)
				{
					if(a_list_left[i].getAttribute('href') === "/login")
					{
						a_list_left[i].setAttribute('href', "/change_user");
						a_list_left[i].querySelector(".title").innerHTML = "thong tin tai khoan";
					}
					if(a_list_left[i].getAttribute('href') !== "/off")
					a_list_left[i].setAttribute('href', (origin_http + a_list_left[i].getAttribute('href') + `?user=${params_get.get("user")}`));
					else a_list_left[i].setAttribute('href', "/");
				}
			}
		}
		if(data_path.toString() === "/admin"){
			hd_main_info();
			nv_main_info();
		}
		if(data_path.toString().includes("/shop")){
			order_buy();
		}
        if(data_path.toString().includes("/change_user")){
            register_user();
        }
		if(data_path.toString().includes("/admin/change_sp")){
			if(params_get.has("sp") === true && params_get.has("nv") === true){
				register_sanpham();
			}
		}
		if(data_path.toString().includes("/admin/taikhoan")){
			kh_main_info();
			setTimeout(() => {
				delete_change_kh();
			}, 600);
		}
		if(data_path.toString().includes("/admin/hoadon")){
			hd_main_info();
			setTimeout(() => {
				delete_change_hd();
			}, 600);
		}
		if(data_path.toString().includes("/admin/change_hd")){
			if(sessionStorage.getItem("hd_id_info")){
				hd_detail();
			}
		}
		if(data_path.toString().includes("/admin/change_kh")){
			if(sessionStorage.getItem("kh_id_info")){
				kh_detail();
			}
		}
    }
	if(data_path.toString().includes("/sp/detail"))
	{
		if(params_get.has("sp") === true){
			detail_sp();
		}
	}
}else{
	if(data_path.toString().includes("/shop")){
		const for_shopping = document.createElement("h2");
		for_shopping.innerHTML = "phai dang nhap";
		document.querySelector(".list_detail .detail_head").appendChild(for_shopping);
		document.getElementById("shop_order").href = "/login";
		document.getElementById("shop_order").innerHTML = "dang nhap"
	}
}
if(data_path.toString() === "/"){
//showing info all item in group san pham
	sp_main_info();
	async function sp_main_info(){
		const get_data = await fetch("/all_sp");
		const data = await get_data.json();
		let a = 0;
		for(let item of data){
			switch(item.kind)
			{
				case "canh_doi":
				{
					//áo mưa cánh dơi
					const img = Array.from(document.querySelectorAll("#canh_doi .body_info_img a img"));
					const detail = Array.from(document.querySelectorAll("#canh_doi .body_info_img a"));
					const name = Array.from(document.querySelectorAll("#canh_doi .info_img p"));
					const cost = Array.from(document.querySelectorAll("#canh_doi .info_img span"));
					for(let i =0; i < detail.length; i++){
						if(detail[i].getAttribute('href') === "/sp/detail")
						{
							img[i].src = item.hinh_anh;
							detail[i].setAttribute('href', (origin_http + detail[i].getAttribute('href') + `?sp=${item._id}`)) ;
							name[i].innerHTML = item.ten;
							cost[i].innerHTML = item.cost;
							break;
						}
					}
					break;
				}
				case "bo":
				{
					// áo mưa bộ
					const img = Array.from(document.querySelectorAll("#bo .body_info_img a img")); //.src = item.hinh_anh
					const name = Array.from(document.querySelectorAll("#bo .info_img p")); //.innerHTML = item.ten
					const detail = Array.from(document.querySelectorAll("#bo .body_info_img a"));
					const cost = Array.from(document.querySelectorAll("#bo .info_img span")); //.innerHTML = atem.cost
					for(let i =0; i < detail.length; i++){
						if(detail[i].getAttribute('href') === "/sp/detail")
						{
							img[i].src = item.hinh_anh;
							detail[i].setAttribute('href', (origin_http + detail[i].getAttribute('href') + `?sp=${item._id}`)) ;
							name[i].innerHTML = item.ten;
							cost[i].innerHTML = item.cost;
							break;
						}
					}
					break;
				}
				case "tre_em":
				{
					// áo mưa trẻ em
					const img = Array.from(document.querySelectorAll("#tre_em .body_info_img img"));
					const detail = Array.from(document.querySelectorAll("#tre_em .body_info_img a"));
					const name = Array.from(document.querySelectorAll("#tre_em .info_img p"));
					const cost = Array.from(document.querySelectorAll("#tre_em .info_img span"));
					for(let i =0; i < detail.length; i++){
						if(detail[i].getAttribute('href') === "/sp/detail")
						{
							img[i].src = item.hinh_anh;
							detail[i].setAttribute('href', (origin_http + detail[i].getAttribute('href') + `?sp=${item._id}`)) ;
							name[i].innerHTML = item.ten;
							cost[i].innerHTML = item.cost;
							break;
						}
					}
					break;
				}
				case "badesi":
				{
					//áo mưa badesi
					const img = Array.from(document.querySelectorAll("#badesi .body_info_img img"));
					const detail = Array.from(document.querySelectorAll("#badesi .body_info_img a"));
					const name = Array.from(document.querySelectorAll("#badesi .info_img p"));
					const cost = Array.from(document.querySelectorAll("#badesi .info_img span"));
					for(let i =0; i < detail.length; i++){
						if(detail[i].getAttribute('href') === "/sp/detail")
						{
							img[i].src = item.hinh_anh;
							detail[i].setAttribute('href', (origin_http + detail[i].getAttribute('href') + `?sp=${item._id}`)) ;
							name[i].innerHTML = item.ten;
							cost[i].innerHTML = item.cost;
							break;
						}
					}
					break;
				}
				case "may_giac":
				{
					//áo trùm máy giặt
					const img = Array.from(document.querySelectorAll("#may_giac .body_info_img img"));
					const detail = Array.from(document.querySelectorAll("#may_giac .body_info_img a"));
					const name = Array.from(document.querySelectorAll("#may_giac .info_img p"));
					const cost = Array.from(document.querySelectorAll("#may_giac .info_img span"));
					for(let i =0; i < detail.length; i++){
						if(detail[i].getAttribute('href') === "/sp/detail")
						{
							img[i].src = item.hinh_anh;
							detail[i].setAttribute('href', (origin_http + detail[i].getAttribute('href') + `?sp=${item._id}`)) ;
							name[i].innerHTML = item.ten;
							cost[i].innerHTML = item.cost;
							break;
						}
					}
					break;
				}
				case "phu_xe":
				{
					//áo trùm phủ xe
					const img = Array.from(document.querySelectorAll("#phu_xe .body_info_img img"));
					const detail = Array.from(document.querySelectorAll("#phu_xe .body_info_img a"));
					const name = Array.from(document.querySelectorAll("#phu_xe .info_img p"));
					const cost = Array.from(document.querySelectorAll("#phu_xe .info_img span"));
					for(let i =0; i < detail.length; i++){
						if(detail[i].getAttribute('href') === "/sp/detail")
						{
							img[i].src = item.hinh_anh;
							detail[i].setAttribute('href', (origin_http + detail[i].getAttribute('href') + `?sp=${item._id}`)) ;
							name[i].innerHTML = item.ten;
							cost[i].innerHTML = item.cost;
							break;
						}
					}
					break;
				}
			}
			if((Math.floor(Math.random() * 4) === a) || a > 10){
				const img = Array.from(document.querySelectorAll("#random .body_info_img img"));
				const detail = Array.from(document.querySelectorAll("#random .body_info_img a"));
				const name = Array.from(document.querySelectorAll("#random .info_img p"));
				const cost = Array.from(document.querySelectorAll("#random .info_img span"));
				for(let i =0; i < detail.length; i++){
					if(detail[i].getAttribute('href') === "/sp/detail")
					{
						img[i].src = item.hinh_anh;
						detail[i].setAttribute('href', (origin_http + detail[i].getAttribute('href') + `?sp=${item._id}`)) ;
						name[i].innerHTML = item.ten;
						cost[i].innerHTML = item.cost;
						a = 0;
						break;
					}
				}
			}
			a++;
		}
		if(params_get.has("user") === true){
			let a_list_right = Array.from(document.querySelectorAll(".right_body_info .body_info_img a"));
			if(params_get.has("nv") === true)
			{
				for(let i = 0; i < a_list_right.length; i++)
				{
					if(a_list_right[i].getAttribute('href') !== "/sp/detail")
					a_list_right[i].setAttribute('href' , (a_list_right[i].getAttribute('href') + `&user=${params_get.get("user")}&nv=${params_get.get("nv")}`));
				}
			}
			else{
				for(let i = 0; i < a_list_right.length; i++)
				{
					
					if(a_list_right[i].getAttribute('href') !== "/sp/detail")
					a_list_right[i].setAttribute('href', (a_list_right[i].getAttribute('href') + `&user=${params_get.get("user")}`));
				}
			}
		}
	}
}
if(data_path.toString().includes("/allkind/")){
	const part = data_path.split("/");
	for(let i = 0; i < part.length; i++){
		switch(part[i])
		{
			case "canh_doi":
			{
				//áo mưa cánh dơi
				slot_kind_sp(part[i]);
				break;
			}
			case "bo":
			{
				// áo mưa bộ
				slot_kind_sp(part[i]);
				break;
			}
			case "tre_em":
			{
				// áo mưa trẻ em
				slot_kind_sp(part[i]);
				break;
			}
			case "badesi":
			{
				//áo mưa badesi
				slot_kind_sp(part[i]);
				break;
			}
			case "may_giac":
			{
				//áo trùm máy giặt
				slot_kind_sp(part[i]);
				break;
			}
			case "phu_xe":
			{
				//áo trùm phủ xe
				slot_kind_sp(part[i]);
				break;
			}
		}
	}
}
if(data_path.toString() === "/allkind"){
//showing info kind of item in group san pham
	sp_kind_info();
	async function sp_kind_info(){
		const get_data = await fetch("/all_sp");
		const data = await get_data.json();
		for(let item of data){
			switch(item.kind)
			{
				case "canh_doi":
				{
					//áo mưa cánh dơi
					const img = Array.from(document.querySelectorAll("#canh_doi .body_info_img img"));
					const detail = Array.from(document.querySelectorAll("#canh_doi .body_info_img a"));
					const name = Array.from(document.querySelectorAll("#canh_doi .info_img p"));
					const cost = Array.from(document.querySelectorAll("#canh_doi .info_img span"));
					for(let i =0; i < detail.length; i++){
						if(detail[i].getAttribute('href') === "/sp/detail")
						{
							img[i].src = item.hinh_anh;
							detail[i].setAttribute('href', (origin_http + detail[i].getAttribute('href') + `?sp=${item._id}`)) ;
							name[i].innerHTML = item.ten;
							cost[i].innerHTML = item.cost;
							break;
						}
					}
					break;
				}
				case "bo":
				{
					// áo mưa bộ
					const img = Array.from(document.querySelectorAll("#bo .body_info_img img")); //.src = item.hinh_anh
					const detail = Array.from(document.querySelectorAll("#bo .body_info_img a"));
					const name = Array.from(document.querySelectorAll("#bo .info_img p")); //.innerHTML = item.ten
					const cost = Array.from(document.querySelectorAll("#bo .info_img span")); //.innerHTML = atem.cost
					for(let i =0; i < detail.length; i++){
						if(detail[i].getAttribute('href') === "/sp/detail")
						{
							img[i].src = item.hinh_anh;
							detail[i].setAttribute('href', (origin_http + detail[i].getAttribute('href') + `?sp=${item._id}`)) ;
							name[i].innerHTML = item.ten;
							cost[i].innerHTML = item.cost;
							break;
						}
					}
					break;
				}
				case "tre_em":
				{
					// áo mưa trẻ em
					const img = Array.from(document.querySelectorAll("#tre_em .body_info_img img"));
					const detail = Array.from(document.querySelectorAll("#tre_em .body_info_img a"));
					const name = Array.from(document.querySelectorAll("#tre_em .info_img p"));
					const cost = Array.from(document.querySelectorAll("#tre_em .info_img span"));
					for(let i =0; i < detail.length; i++){
						if(detail[i].getAttribute('href') === "/sp/detail")
						{
							img[i].src = item.hinh_anh;
							detail[i].setAttribute('href', (origin_http + detail[i].getAttribute('href') + `?sp=${item._id}`)) ;
							name[i].innerHTML = item.ten;
							cost[i].innerHTML = item.cost;
							break;
						}
					}
					break;
				}
				case "badesi":
				{
					//áo mưa badesi
					const img = Array.from(document.querySelectorAll("#badesi .body_info_img img"));
					const detail = Array.from(document.querySelectorAll("#badesi .body_info_img a"));
					const name = Array.from(document.querySelectorAll("#badesi .info_img p"));
					const cost = Array.from(document.querySelectorAll("#badesi .info_img span"));
					for(let i =0; i < detail.length; i++){
						if(detail[i].getAttribute('href') === "/sp/detail")
						{
							img[i].src = item.hinh_anh;
							detail[i].setAttribute('href', (origin_http + detail[i].getAttribute('href') + `?sp=${item._id}`)) ;
							name[i].innerHTML = item.ten;
							cost[i].innerHTML = item.cost;
							break;
						}
					}
					break;
				}
				case "may_giac":
				{
					//áo trùm máy giặt
					const img = Array.from(document.querySelectorAll("#may_giac .body_info_img img"));
					const detail = Array.from(document.querySelectorAll("#may_giac .body_info_img a"));
					const name = Array.from(document.querySelectorAll("#may_giac .info_img p"));
					const cost = Array.from(document.querySelectorAll("#may_giac .info_img span"));
					for(let i =0; i < detail.length; i++){
						if(detail[i].getAttribute('href') === "/sp/detail")
						{
							img[i].src = item.hinh_anh;
							detail[i].setAttribute('href', (origin_http + detail[i].getAttribute('href') + `?sp=${item._id}`)) ;
							name[i].innerHTML = item.ten;
							cost[i].innerHTML = item.cost;
							break;
						}
					}
					break;
				}
				case "phu_xe":
				{
					//áo trùm phủ xe
					const img = Array.from(document.querySelectorAll("#phu_xe .body_info_img img"));
					const detail = Array.from(document.querySelectorAll("#phu_xe .body_info_img a"));
					const name = Array.from(document.querySelectorAll("#phu_xe .info_img p"));
					const cost = Array.from(document.querySelectorAll("#phu_xe .info_img span"));
					for(let i =0; i < detail.length; i++){
						if(detail[i].getAttribute('href') === "/sp/detail")
						{
							img[i].src = item.hinh_anh;
							detail[i].setAttribute('href', (origin_http + detail[i].getAttribute('href') + `?sp=${item._id}`)) ;
							name[i].innerHTML = item.ten;
							cost[i].innerHTML = item.cost;
							break;
						}
					}
					break;
				}
			}
		}
		if(params_get.has("user") === true){
			let a_list_right = Array.from(document.querySelectorAll(".right_body_info .body_info_img a"));
			if(params_get.has("nv") === true)
			{
				for(let i = 0; i < a_list_right.length; i++)
				{
					if(a_list_right[i].getAttribute('href') !== "/sp/detail")
					a_list_right[i].setAttribute('href' , (a_list_right[i].getAttribute('href') + `&user=${params_get.get("user")}&nv=${params_get.get("nv")}`));
				}
			}
			else{
				for(let i = 0; i < a_list_right.length; i++)
				{
					
					if(a_list_right[i].getAttribute('href') !== "/sp/detail")
					a_list_right[i].setAttribute('href', (a_list_right[i].getAttribute('href') + `&user=${params_get.get("user")}`));
				}
			}
		}
	}
}
if(sessionStorage.getItem("order_sp")){
	let notify = Array.from(document.querySelectorAll(".left_nav ul li.line_side a"));
	for(let i = 0; i< notify.length; i++){
		if(notify[i].getAttribute('href').includes("/shop") && (JSON.parse(sessionStorage.getItem("order_sp")).length) > 0)
		{
			const show_number = document.createElement("span");
			show_number.innerHTML = JSON.parse(sessionStorage.getItem("order_sp")).length;
			show_number.style.backgroundColor = "rgb(209, 73, 91)";
			show_number.style.color = "white";
			show_number.style.margin = "0 0 0 60px";
			show_number.style.padding = "5px 20px";
			show_number.style.lineHeight = 45+"px";
			show_number.style.borderRadius = 30+"px";
			show_number.setAttribute("id", "order_number");
			notify[i].appendChild(show_number);
		}
	}
}
if(data_path.toString().includes("/admin/sanpham")){ // done
//showing all san pham
	sp_all();
	async function sp_all(){
		const get_data = await fetch("/all_sp");
		const data = await get_data.json();
		const list_hold = Array.from(document.querySelectorAll(".right_body_info .body_info_img"));
		const img = Array.from(document.querySelectorAll(".right_body_info .body_info_img img"));
		const detail = Array.from(document.querySelectorAll(".right_body_info .body_info_img a"));
		const name = Array.from(document.querySelectorAll(".right_body_info .info_img p"));
		const cost = Array.from(document.querySelectorAll(".right_body_info .info_img span"));
		for(let i =0; i < data.length; i++){
			if(list_hold[i])
			{
				if(detail[i].getAttribute('href') === "/admin/change_sp" && detail[i].getAttribute('href') !== "/admin/create_sp")
				{
					img[i].src = data[i].hinh_anh;
					detail[i].setAttribute('href', (origin_http + detail[i].getAttribute('href') + `?sp=${data[i]._id}`)) ;
					name[i].innerHTML = data[i].ten;
					cost[i].innerHTML = data[i].cost;
				}
			}
			else{
				const make_list_hold = document.createElement("div");
				const make_link_hold = document.createElement("a");
				const make_img = document.createElement("img");
				const make_info_hold = document.createElement("ul");
				const make_info_name = document.createElement("li");
				const make_info_cost = document.createElement("li");
				const name = document.createElement("p");
				const cost = document.createElement("span");
				make_list_hold.setAttribute("class", "body_info_img");
				make_link_hold.setAttribute("href", (origin_http + "/admin/change_sp" + `?sp=${data[i]._id}`));
				make_info_hold.setAttribute("class", "info_img");
				make_img.src = data[i].hinh_anh;
				name.innerHTML = data[i].ten;
				cost.innerHTML = data[i].cost;
				make_info_name.appendChild(name);
				make_info_cost.appendChild(cost);
				make_info_hold.append(make_info_name,make_info_cost);
				make_link_hold.append(make_img,make_info_hold);
				make_list_hold.appendChild(make_link_hold);
				document.querySelector(".right_body_info").appendChild(make_list_hold);
				document.querySelector(".right_body_info").appendChild(document.querySelector(".right_body_info #last"));
			}
		}
		if(params_get.has("user") === true){
			let a_list_right = Array.from(document.querySelectorAll(".right_body_info .body_info_img a"));
			if(params_get.has("nv") === true)
			{
				for(let i = 0; i < a_list_right.length; i++)
				{
					if(a_list_right[i].getAttribute('href') !== "/admin/change_sp")
					a_list_right[i].setAttribute('href' , (a_list_right[i].getAttribute('href') + `&user=${params_get.get("user")}&nv=${params_get.get("nv")}`));
				}
			}
			document.querySelector(".right_body_info #last a").setAttribute('href' , (document.querySelector(".right_body_info #last a").getAttribute('href') 
			+ `?user=${params_get.get("user")}&nv=${params_get.get("nv")}`));
		}
	}
}
//showing one kind of item
async function slot_kind_sp(kind_info){
	const data_send = {
        search: kind_info
    };
    const server_get =
    {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_send)
    };
	const send_data = await fetch("/kind_list", server_get);
    const data = await send_data.json();
	const img = Array.from(document.querySelectorAll(".right_body_info .body_info_img a img"));
	const detail = Array.from(document.querySelectorAll(".right_body_info .body_info_img a"));
	const name = Array.from(document.querySelectorAll(".right_body_info .info_img p"));
	const cost = Array.from(document.querySelectorAll(".right_body_info .info_img span"));
	for(let item of data){
		for(let i = 0; i < detail.length; i++){
			if(detail[i].getAttribute('href') === "/sp/detail")
			{
				img[i].src = item.hinh_anh;
				detail[i].setAttribute('href', (origin_http + detail[i].getAttribute('href') + `?sp=${item._id}`)) ;
				name[i].innerHTML = item.ten;
				cost[i].innerHTML = item.cost;
				break;
			}
		}
	}
	if(params_get.has("user") === true){
		let a_list_right = Array.from(document.querySelectorAll(".right_body_info .body_info_img a"));
		if(params_get.has("nv") === true)
		{
			for(let i = 0; i < a_list_right.length; i++)
			{
				if(a_list_right[i].getAttribute('href') !== "/sp/detail")
				a_list_right[i].setAttribute('href' , (a_list_right[i].getAttribute('href') + `&user=${params_get.get("user")}&nv=${params_get.get("nv")}`));
			}
		}
		else{
			for(let i = 0; i < a_list_right.length; i++)
			{
				
				if(a_list_right[i].getAttribute('href') !== "/sp/detail")
				a_list_right[i].setAttribute('href', (a_list_right[i].getAttribute('href') + `&user=${params_get.get("user")}`));
			}
		}
	}
}
// lay hinh anh tu tai khoan
async function login_img(){	//done
    const data_send = {
        id: params_get.get("user")
    };
    const server_get =
    {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_send)
    };
    const send_data = await fetch("/img_user", server_get);
    const data = await send_data.json(); 
	// console.log(data);
    document.querySelector(".user_admin img").src  = data.hinh_anh;
    document.querySelector(".user_admin").setAttribute("class", "user_admin");
    document.querySelector(".right_head").setAttribute("class", "right_head");
	if(document.querySelector(".searching_engi"))
    document.querySelector(".searching_engi").setAttribute("class", "searching_engi");
}
// lay thong tin nguoi dung
async function register_user(){ //not done check again
    let data_send = {
        id: params_get.get("user")
    };
    let server_get =
    {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_send)
    };
    let send_data = await fetch("/info_user", server_get);
    let data = await send_data.json(); 
    document.getElementById("user_name").value = `${data.user}`;
    document.getElementById("ho_ten").value = `${data.ten}`;
    document.getElementById("sdt").value = `${data.sdt}`;
    document.getElementById("email").value = `${data.email}`;
    document.querySelector(".preshow_img").src  = data.hinh_anh;
    document.getElementById("change_info").style.display = "block";
    document.getElementById("register").style.display = "none";
    document.getElementById("user_name").readOnly = true;
    document.getElementById("password").style.display = "none";
	document.getElementById("delete_info").style.display = "block";
	//reupload new info user to the data
	document.getElementById("change_info").addEventListener("click", async function() {
		const ho_ten = document.getElementById("ho_ten").value;
		const sdt = document.getElementById("sdt").value;
		const email = document.getElementById("email").value;
		if(hinh_anh === null){
			hinh_anh = data.hinh_anh;
		}
		data_send = {
			id: params_get.get("user")
			, tai_khoan:{
				hinh_anh: hinh_anh
			}
			, ho_ten
			, sdt
			, email
		};
		server_get =
		{
			method: "POST",
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(data_send)
		};
		send_data = await fetch("/reupload_tk", server_get);
		data = await send_data.json(); 
		console.log(data);
		if(data.changed){
			location.reload();
		}else{
			const for_shopping = document.createElement("h2");
			for_shopping.innerHTML = data.status;
			document.querySelector(".list_detail .detail_head").appendChild(for_shopping);
		}
	});
	//remove the info of data
	document.getElementById("delete_info").addEventListener("click", async function() {
		data_send = {
			id: params_get.get("user")
		};
		server_get =
		{
			method: "POST",
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(data_send)
		};
		send_data = await fetch("/delete_tk", server_get);
		data = await send_data.json();
		if(data.remove){
			window.location.href = origin_http + `/login`;
		}
		else{
			alert(data.status);
		}
	});
}
// lay thong tin san pham
async function register_sanpham(){ //done
    let data_send = {
        id: params_get.get("sp")
    };
    let server_get =
    {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_send)
    };
    let send_data = await fetch("/info_sp", server_get);
    let data = await send_data.json(); 
	console.log(data);
    document.getElementById("sp_name").value = `${data.ten}`;
    document.getElementById("sp_cost").value = `${data.cost}`;
    document.getElementById("sp_kind").value = `${data.kind}`;
    document.getElementById("sp_info").value = `${data.info}`;
    document.getElementById("sp_detail").value = `${data.detail}`;
    document.querySelector(".preshow_img").src  = data.hinh_anh;
    document.getElementById("change_info").style.display = "block";
    document.getElementById("register_sp").style.display = "none";
	document.getElementById("delete_info").style.display = "block";
	//reupload new info sanpham to the data
	document.getElementById("change_info").addEventListener("click", async function() {
		const ten = document.getElementById("sp_name").value;
		const cost = document.getElementById("sp_cost").value;
		const kind = document.getElementById("sp_kind").value;
		const info = document.getElementById("sp_info").value;
		const detail = document.getElementById("sp_detail").value;
		if(hinh_anh === null){
			hinh_anh = data.hinh_anh;
		}
		data_send = {
			id: params_get.get("sp")
			, ten: ten
			, cost: cost
			, kind: kind
			, info: info
			, detail: detail
			, hinh_anh: hinh_anh
		};
		server_get =
		{
			method: "POST",
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(data_send)
		};
		send_data = await fetch("/reupload_sp", server_get);
		data = await send_data.json(); 
		console.log(data);
		if(data.changed){
			location.reload();
		}
	});
	//remove the info of data
	document.getElementById("delete_info").addEventListener("click", async function() {
		data_send = {
			id: params_get.get("sp")
		};
		server_get =
		{
			method: "POST",
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(data_send)
		};
		send_data = await fetch("/delete_sp", server_get);
		data = await send_data.json();
		if(data.remove){
			window.location.href = origin_http + `/admin/sanpham?user=${params_get.get("user")}&nv=${params_get.get("nv")}`;
		}
		else{
			alert(data.status);
		}
	});
}
//lay thong tin 1 san pham chi tiet
async function detail_sp(){
	const data_send = {
        id: params_get.get("sp")
    };
    const server_get =
    {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data_send)
    };
    const send_data = await fetch("/detail_sp", server_get);
    const data = await send_data.json(); 
	console.log(data);
	document.querySelector(".right_body_detail .detail_img img").src  = data.hinh_anh;
	document.querySelector(".detail_body .detail_body_style #cost_item").innerHTML = data.cost;
    document.querySelector(".detail_body #name_item").innerHTML = data.ten;
	switch(data.kind)
	{
		case "canh_doi":
		{
			document.querySelector(".detail_body .detail_body_style #group_item").innerHTML = "áo mưa cánh dơi";
			break;
		}
		case "bo":
		{
			document.querySelector(".detail_body .detail_body_style #group_item").innerHTML = "áo mưa bộ";
			break;
		}
		case "tre_em":
		{
			document.querySelector(".detail_body .detail_body_style #group_item").innerHTML = "áo mưa trẻ em";
			break;
		}
		case "badesi":
		{
			document.querySelector(".detail_body .detail_body_style #group_item").innerHTML = "áo mưa badesi";
			break;
		}
		case "may_giac":
		{
			document.querySelector(".detail_body .detail_body_style #group_item").innerHTML = "áo trùm máy giặt";
			break;
		}
		case "phu_xe":
		{
			document.querySelector(".detail_body .detail_body_style #group_item").innerHTML = "áo trùm phủ xe";
			break;
		}
	}
	document.querySelector(".detail_info #name_item").innerHTML = data.ten;
    document.querySelector(".detail_info #info_item").innerHTML = data.info;
    document.querySelector(".detail_info #detail_item").innerHTML = data.detail;
}
/*show img to custumer*/
if(document.getElementById("img_select")){
	const flie_img = document.getElementById("img_select");
	const preview_div = document.querySelector(".img_preshow");
	const preview_img = preview_div.querySelector(".preshow_img");
	var hinh_anh = null;
	flie_img.addEventListener("change", function() {
		const file = this.files[0];
		console.log(file);
		if(file)
		{
			const reader = new FileReader();
			preview_img.style.display = "block";
			reader.addEventListener("load", function() {
				preview_img.setAttribute("src", this.result);
				hinh_anh = this.result;
			});
			reader.readAsDataURL(file);
		}else
		{
			preview_img.style.display = "none";
			preview_img.setAttribute("src", "");
		}
	});
}
//luu thong tin hoa don
async function order_buy(){ //done
	const buy_order = document.querySelector(".shop_list .shop_list_foot #shop_order");
	const totalcost = document.querySelector(".shop_list .shop_list_foot #total_cost_all");
	buy_order.addEventListener('click', async function(){
		let order_array = JSON.parse(sessionStorage.getItem("order_sp"));
		const data_send = {
			order_list: order_array
			, money: totalcost.innerHTML
			, id: params_get.get("user")
		};
		const server_get =
		{
			method: "POST",
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(data_send)
		};
		const send_data = await fetch("/save_hd", server_get);
		const data = await send_data.json();
		console.log(data);
		if(data.created){
			sessionStorage.removeItem("order_sp");
			location.reload();
		}
		else{
			sessionStorage.removeItem("order_sp");
			window.location.href = origin_http + `/`;
		}
	});
}
//the hien tat ca hoa don va tat ca nhan vien
async function hd_main_info(){ //done
    const get_data = await fetch("/all_hd");
    const data = await get_data.json();
	// console.log(data);
	let list_hold = Array.from(document.querySelectorAll(".hd_list .hd_list_body tr"));
	let name = Array.from(document.querySelectorAll(".hd_list .hd_list_body #user_name"));
	const number = Array.from(document.querySelectorAll(".hd_list .hd_list_body #number"));
	const cost = Array.from(document.querySelectorAll(".hd_list .hd_list_body #cost"));
	const status_list = Array.from(document.querySelectorAll(".hd_list .hd_list_body td .status"));
	let a =0;
	for(let item of data){
		const data_send = {
			id: item.id_buyer
		};
		const server_get =
		{
			method: "POST",
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(data_send)
		};
		const send_data = await fetch("/info_tk", server_get);
		const json_get = await send_data.json();
		for(let i = 0; i < list_hold.length; i++){
			if(list_hold[a])
			{
				if(number[i].innerHTML === "number")
				{
					name[i].innerHTML = json_get.name;
					number[i].innerHTML = item.order_list.length;
					cost[i].innerHTML = item.money;
					switch(Math.floor(Math.random() * 4))
					{
						case 0:{
							status_list[i].innerHTML = "bo";
							status_list[i].style.color = "var(--white)";
							status_list[i].style.background = "#f00";
							break;
						}
						case 1:{
							status_list[i].innerHTML = "dang giao";
							status_list[i].style.color = "var(--white)";
							status_list[i].style.background = "#1795ce";
							break;
						}
						case 2:{
							status_list[i].innerHTML = "nhan";
							status_list[i].style.color = "var(--white)";
							status_list[i].style.background = "#8de02c";
							break;
						}
						case 3:{
							status_list[i].innerHTML = "tra";
							status_list[i].style.color = "var(--white)";
							status_list[i].style.background = "#f9ca3f";
							break;
						}
					}
					break;
				}
			}else{
				const make_list_hold =  document.createElement("tr");
				const make_name = document.createElement("td");
				const make_number = document.createElement("td");
				const make_cost = document.createElement("td");
				const make_status_hold = document.createElement("td");
				const make_status = document.createElement("span");
				make_name.setAttribute("id", "name");
				make_number.setAttribute("id", "number");
				make_cost.setAttribute("id", "cost");
				make_status.setAttribute("class", "status");
				make_name.innerHTML = json_get.name;
				make_number.innerHTML = item.order_list.length;
				make_cost.innerHTML = item.money;
				switch(Math.floor(Math.random() * 4))
				{
					case 0:{
						make_status.innerHTML = "bo";
						make_status.style.color = "var(--white)";
						make_status.style.background = "#f00";
						break;
					}
					case 1:{
						make_status.innerHTML = "dang giao";
						make_status.style.color = "var(--white)";
						make_status.style.background = "#1795ce";
						break;
					}
					case 2:{
						make_status.innerHTML = "nhan";
						make_status.style.color = "var(--white)";
						make_status.style.background = "#8de02c";
						break;
					}
					case 3:{
						make_status.innerHTML = "tra";
						make_status.style.color = "var(--white)";
						make_status.style.background = "#f9ca3f";
						break;
					}
				}
				if(data_path.toString().includes("/admin/hoadon"))
				{
					const make_delete_hold = document.createElement("td");
					const make_change_hold = document.createElement("td");
					const make_delete = document.createElement("span");
					const make_change = document.createElement("span");
					make_delete.setAttribute("id", "delete");
					make_change.setAttribute("id", "change");
					make_delete.innerHTML= "xoá";
					make_change.innerHTML= "thay đổi";
					make_delete_hold.appendChild(make_delete);
					make_change_hold.appendChild(make_change);
					make_status_hold.appendChild(make_status);
					make_list_hold.append(make_name,make_cost,make_number,make_status_hold,make_delete_hold,make_change_hold);
					document.querySelector(".hd_list .hd_list_body").appendChild(make_list_hold);
				}else{
				make_status_hold.appendChild(make_status);
				make_list_hold.append(make_name,make_number,make_cost,make_status_hold);
				document.querySelector(".hd_list .hd_list_body").appendChild(make_list_hold);
				}
			}
		}
		a++;
	}
}
//the hien tat ca nhan vien
async function nv_main_info(){
	const send_data = await fetch("/list_nv");
	const json_get = await send_data.json();
	// console.log(json_get);
	list_hold = Array.from(document.querySelectorAll(".nv_list tbody tr"));
	const name = Array.from(document.querySelectorAll(".nv_list tbody #name"));
	const sdt = Array.from(document.querySelectorAll(".nv_list tbody #sdt"));
	const img = Array.from(document.querySelectorAll(".nv_list tbody .user_img img"));
	let a = 0;
	for(let item of json_get){
		for(let i = 0; i < list_hold.length; i++){
			if(list_hold[a])
			{
				if(img[i].src.includes("/img/"))
				{
					img[i].src = item.hinh_anh;
					name[i].innerHTML = `${item.ho_ten} <br/><span id="sdt"> ${item.sdt}</span>`;
					break;
				}
			}else{
				const make_list_hold = document.createElement("tr");
				const make_name_hold = document.createElement("td");
				const make_name = document.createElement("h4");
				const make_img_hold = document.createElement("td");
				const make_img = document.createElement("img");
				make_name.setAttribute("id", "name");
				make_img_hold.setAttribute("class", "user_img");
				make_name.innerHTML = `${item.ho_ten} <br/><span id="sdt"> ${item.sdt}</span>`;
				make_img.src = item.hinh_anh;
				make_name_hold.appendChild(make_name);
				make_img_hold.appendChild(make_img);
				make_list_hold.append(make_img_hold,make_name_hold);
				document.querySelector(".nv_list tbody").appendChild(make_list_hold);
			}
		}
		a++;
	}
}
//the hien tat ca khach hang
async function kh_main_info(){
	const get_data = await fetch("/list_kh");
    let data = await get_data.json();
	console.log(data);
	const list_hold = Array.from(document.querySelectorAll(".tk_list .tk_list_body tr"));
	const name = Array.from(document.querySelectorAll(".tk_list .tk_list_body #name"));
	const sdt = Array.from(document.querySelectorAll(".tk_list .tk_list_body #sdt"));
	const check = Array.from(document.querySelectorAll(".tk_list .tk_list_body #nv_check"));
	const user = Array.from(document.querySelectorAll(".tk_list .tk_list_body #user"));
	let a = 0;
	for(let item of data){
		for(let i = 0; i < list_hold.length; i++){
			if(list_hold[a])
			{
				if(user[i].innerHTML === "tài khoản")
				{
					name[i].innerHTML = item.ho_ten;
					sdt[i].innerHTML = item.sdt;
					if(item.check === false) check[i].innerHTML = "khách hàng";
					user[i].innerHTML = item.user;
					break;
				}
			}else{
				const make_list_hold = document.createElement("tr");
				const make_name = document.createElement("td");
				const make_sdt = document.createElement("td");
				const make_check = document.createElement("td");
				const make_user = document.createElement("td");
				make_name.setAttribute("id", "name");
				make_sdt.setAttribute("id", "sdt");
				make_check.setAttribute("id", "nv_check");
				make_user.setAttribute("id", "user");
				make_name.innerHTML = item.ho_ten;
				make_sdt.innerHTML = item.sdt;
				if(item.check === false)
				make_check.innerHTML ="khách hàng";
				make_user.innerHTML = item.user;
				const make_delete_hold = document.createElement("td");
				const make_change_hold = document.createElement("td");
				const make_delete = document.createElement("span");
				const make_change = document.createElement("span");
				make_delete.setAttribute("id", "delete");
				make_change.setAttribute("id", "change");
				make_delete.innerHTML= "xoá";
				make_change.innerHTML= "thay đổi";
				make_delete_hold.appendChild(make_delete);
				make_change_hold.appendChild(make_change);
				
				make_list_hold.append(make_name,make_sdt,make_check,make_user,make_delete_hold,make_change_hold);
				document.querySelector(".tk_list .tk_list_body").appendChild(make_list_hold);
			}
		}
		a++;
	}
}
//danh sach suaw/xoa hoa don
async function delete_change_hd(){
	const get_data = await fetch("/all_hd");
    let data = await get_data.json();
	let destroy = Array.from(document.querySelectorAll(".hd_list .hd_list_body #delete"));
	let change = Array.from(document.querySelectorAll(".hd_list .hd_list_body #change"));
	for(let i =0; i < data.length; i++){
		destroy[i].addEventListener("click", async function() {
			data_send = {
				id: data[i]._id
			};
			server_get =
			{
				method: "POST",
				headers: {
				  'Content-Type': 'application/json'
				},
				body: JSON.stringify(data_send)
			};
			send_data = await fetch("/delete_hd", server_get);
			data = await send_data.json();
			console.log(data);
			if(data.remove){
				location.reload();
			}
			else{
				alert(data.status);
			}
		});
		change[i].addEventListener("click", async function() {
			sessionStorage.setItem("hd_id_info", data[i]._id);
			window.location.href = origin_http + `/admin/change_hd/?user=${params_get.get("user")}&nv=${params_get.get("nv")}`;
		});
	}
}
// danh sach sua/xoa khach hnag
async function delete_change_kh(){
	const get_data = await fetch("/list_kh");
    let data = await get_data.json();
	let destroy = Array.from(document.querySelectorAll(".tk_list .tk_list_body #delete"));
	let change = Array.from(document.querySelectorAll(".tk_list .tk_list_body #change"));
	for(let i =0; i < data.length; i++){
		destroy[i].addEventListener("click", async function() {
			data_send = {
				id: data[i]._id
			};
			server_get =
			{
				method: "POST",
				headers: {
				  'Content-Type': 'application/json'
				},
				body: JSON.stringify(data_send)
			};
			send_data = await fetch("/delete_tk", server_get);
			data = await send_data.json();
			console.log(data);
			if(data.remove){
				location.reload();
			}
			else{
				alert(data.status);
			}
		});
		change[i].addEventListener("click", async function() {
			sessionStorage.setItem("kh_id_info", data[i].id);
			window.location.href = origin_http + `/admin/change_kh/?user=${params_get.get("user")}&nv=${params_get.get("nv")}`;
		});
	}
}


async function kh_detail(){
	const kh_info = sessionStorage.getItem("kh_id_info");
	let data_send = {
		id: kh_info
	};
	let server_get =
	{
		method: "POST",
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(data_send)
	};
	let send_data = await fetch("/info_user", server_get);
	let data = await send_data.json(); 
	document.getElementById("user_name").value = `${data.user}`;
	document.getElementById("ho_ten").value = `${data.ten}`;
	document.getElementById("sdt").value = `${data.sdt}`;
	document.getElementById("email").value = `${data.email}`;
	document.getElementById("password").value = `${data.pass}`;
	document.querySelector(".preshow_img").src  = data.hinh_anh;
	document.getElementById("change_info").style.display = "block";
	document.getElementById("register").style.display = "none";
	//reupload new info user to the data
	document.getElementById("change_info").addEventListener("click", async function() {
		const ho_ten = document.getElementById("ho_ten").value;
		const sdt = document.getElementById("sdt").value;
		const email = document.getElementById("email").value;
		const user = document.getElementById("user_name").value;
		const pass = document.getElementById("password").value;
		if(hinh_anh === null){
			hinh_anh = data.hinh_anh;
		}
		data_send = {
			id: kh_info
			, tai_khoan:{
				hinh_anh: hinh_anh
				, user: user
				, pass: pass
			}
			, ho_ten
			, sdt
			, email
		};
		server_get =
		{
			method: "POST",
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(data_send)
		};
		send_data = await fetch("/reupload_tk", server_get);
		data = await send_data.json(); 
		// console.log(data);
		
		if(data.changed){
			sessionStorage.removeItem("kh_id_info");
			location.reload();
		}else{
			const for_shopping = document.createElement("h2");
			for_shopping.innerHTML = data.status;
			document.querySelector(".list_detail .detail_head").appendChild(for_shopping);
		}
	});
}


async function hd_detail(){
	const hd_info = sessionStorage.getItem("hd_id_info");
	let data_send = {
		id: hd_info
	};
	let server_get =
	{
		method: "POST",
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(data_send)
	};
	let send_data = await fetch("/info_hd", server_get);
	let data = await send_data.json(); 
	document.querySelector(".list_detail .detail_head h3").innerHTML = new Date(data.date).toLocaleString();
	const all_cost_total = document.querySelector(".shop_list .shop_list_foot #total_cost_all");
	all_cost_total.innerHTML = data.money;
	const list_order = data.list;
	const list_hold = Array.from(document.querySelectorAll(".shop_list .shop_list_body tr"));
	const name = Array.from(document.querySelectorAll(".shop_list .shop_list_body #name"));
	const number = Array.from(document.querySelectorAll(".shop_list .shop_list_body #number"));
	const cost = Array.from(document.querySelectorAll(".shop_list .shop_list_body #cost"));
	const totalcost = Array.from(document.querySelectorAll(".shop_list .shop_list_body #total_cost"));
	for(let i =0; i < list_order.length; i++)
	{
		if(list_hold[i])
		{
			if(list_hold[i].getAttribute("class") === "ordered")
			{
				name[i].innerHTML = list_order[i].name;
				number[i].innerHTML = list_order[i].number;
				cost[i].innerHTML = list_order[i].cost;
				let search_cost = list_order[i].cost;
				let split_cost = search_cost.split('.');
				let holding_1 = split_cost.pop();
				let re_join_cost = ""; 
				if(split_cost.length > 1){
					for(let a =0; a < split_cost.length; a++){
						re_join_cost = re_join_cost + split_cost[a];
					}
				}else{
					re_join_cost = split_cost;
				}
				const total =(parseFloat(list_order[i].number) * parseFloat(re_join_cost));
				totalcost[i].innerHTML = total +"."+ holding_1;
			}else{
				const make_name = document.createElement("td");
				const make_number = document.createElement("td");
				const make_cost = document.createElement("td");
				const make_totalcost = document.createElement("td");
				const make_cancel_holder = document.createElement("td");
				const make_cancel = document.createElement("span");
				make_name.setAttribute("id", "name");
				make_number.setAttribute("id", "number");
				make_cost.setAttribute("id", "cost");
				make_totalcost.setAttribute("id", "total_cost");
				make_cancel.setAttribute("id", "cancel");
				make_name.innerHTML = list_order[i].name;
				make_number.innerHTML = list_order[i].number;
				make_cost.innerHTML = list_order[i].cost;
				let search_cost = list_order[i].cost;
				let split_cost = search_cost.split('.');
				let holding_1 = split_cost.pop();
				let re_join_cost = "";
				if(split_cost.length > 1){
					for(let a =0; a < split_cost.length; a++){
						re_join_cost = re_join_cost + split_cost[a];
					}
				}else{
					re_join_cost = split_cost;
				}
				const total =(parseFloat(list_order[i].number) * parseFloat(re_join_cost));
				document.getElementById("total_cost").value = document.getElementById("total_cost").value + total;
				make_totalcost.innerHTML = total +"."+ holding_1;
				make_cancel.innerHTML = "huy";
				make_cancel_holder.appendChild(make_cancel);
				list_hold[i].append(make_name,make_number,make_cost,make_totalcost,make_cancel_holder);
				list_hold[i].setAttribute("class", "ordered");
			}
		}
		else{
			const make_list_hold =  document.createElement("tr");
				const make_name = document.createElement("td");
				const make_number = document.createElement("td");
				const make_cost = document.createElement("td");
				const make_totalcost = document.createElement("td");
				const make_cancel_holder = document.createElement("td");
				const make_cancel = document.createElement("span");
				make_name.setAttribute("id", "name");
				make_number.setAttribute("id", "number");
				make_cost.setAttribute("id", "cost");
				make_totalcost.setAttribute("id", "total_cost");
				make_cancel.setAttribute("id", "cancel");
				make_name.innerHTML = list_order[i].name;
				make_number.innerHTML = list_order[i].number;
				make_cost.innerHTML = list_order[i].cost;
				let search_cost = list_order[i].cost;
				let split_cost = search_cost.split('.');
				let holding_1 = split_cost.pop();
				let re_join_cost = ""; 
				if(split_cost.length > 1){
					for(let a =0; a < split_cost.length; a++){
						re_join_cost = re_join_cost + split_cost[a];
					}
				}else{
					re_join_cost = split_cost;
				}
				const total =(parseFloat(list_order[i].number) * parseFloat(re_join_cost));
				all_cost = all_cost + total;
				make_totalcost.innerHTML = total +"."+ holding_1;
				make_cancel.innerHTML = "huy";
				make_cancel_holder.appendChild(make_cancel);
				make_list_hold.append(make_name,make_number,make_cost,make_totalcost,make_cancel_holder);
				make_list_hold.setAttribute("class", "ordered");
				document.querySelector(".shop_list .shop_list_body").appendChild(make_list_hold);
		}
		//bo thong tin cu
		/* let list_cancel = document.querySelectorAll(".shop_list .shop_list_body .ordered #cancel");
		for(let i = 0; i < list_cancel.length; i++){
			list_cancel[i].onclick = () =>{
				let array_order = list_order;
				array_order.splice(i , 1);
				list_order[i].name;
				list_order[i].number;
				list_order[i].cost;
			};
		} */
	}
}
