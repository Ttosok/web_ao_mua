// var path_check = (new URL(url)).pathname;
if(data_path.toString().includes("/searching")){
	find_all();
	async function find_all(){
		let lame = sessionStorage.getItem("search_info");
		console.log(lame);
		const data_send = {
			search: lame
		};
		const server_get =
		{
			method: "POST",
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify(data_send)
		};
		const send_data = await fetch("/findAll", server_get);
		const data = await send_data.json();
		console.log(data);
		const list_hold = Array.from(document.querySelectorAll(".right_body_info .body_info_img"));
		const img = Array.from(document.querySelectorAll(".right_body_info .body_info_img img"));
		const detail = Array.from(document.querySelectorAll(".right_body_info .body_info_img a"));
		const name = Array.from(document.querySelectorAll(".right_body_info .info_img p"));
		const cost = Array.from(document.querySelectorAll(".right_body_info .info_img span"));
		for(let i =0; i < data.length; i++){
			if(list_hold[i])
			{
				if(detail[i].getAttribute('href') === "/sp/detail")
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
				make_link_hold.setAttribute("href", (origin_http + "/sp/detail" + `?sp=${data[i]._id}`));
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
		}
		sessionStorage.removeItem("search_info");
	}
}
if(data_path.toString().includes("/admin")){
	const list_left = Array.from(document.querySelectorAll(".left_nav ul li.line_side"));
	for(let i = 0; i < list_left.length; i++)
	{
		let a_list = list_left[i].querySelector("a");
		if(a_list.getAttribute('href').includes("/admin/sanpham")){ list_left[i].style.height = "60px"; }
	}
}
if(data_path.toString().includes("/admin/create_sp")){
//making item goods
	save_sp();
	async function save_sp(){
	let register_data = document.getElementById("register_sp");
		register_data.addEventListener('click', async() =>{
			const ten = document.getElementById("sp_name").value;
			const cost = document.getElementById("sp_cost").value;
			const kind = document.getElementById("sp_kind").value;
			
			const info = document.getElementById("sp_info").value;
			const detail = document.getElementById("sp_detail").value;
			const data_send = {
				ten
				, cost
				, kind
				, hinh_anh
				, info
				, detail
			};
		   const server_get =
			{
				method: "POST",
				headers: {
				  'Content-Type': 'application/json'
				},
				body: JSON.stringify(data_send)
			};
			const send_data = await fetch("/save_sp", server_get);
			const json_get = await send_data.json();
			console.log(json_get);
			if(json_get.created)
			{
				window.location.href = origin_http + `/admin?user=${params_get.get("user")}&nv=true`;
			}
			else if(json_get.had_sp){
				window.location.href = origin_http + `/admin/sp/detail?user=${params_get.get("user")}&nv=true&sp=${json_get.id}`;
			}
			else{
				document.getElementById("make_err").innerHTML = json_get.status;
				console.log(json_get.err);
			}
		});
	}
}
if(data_path.toString().includes("/register")){
//making user 
    save_tk();
	async function save_tk(){
		let register_data = document.getElementById("register");
		register_data.addEventListener('click', async function() {
			let nhanvien = false;
			const user = document.getElementById("user_name").value;
			const mat_khau = document.getElementById("password").value;
			const ho_ten = document.getElementById("ho_ten").value;
			const sdt = document.getElementById("sdt").value;
			const email = document.getElementById("email").value;
			if(params_get.has("admin") || params_get.get("nv") === true) {
				nhanvien = true;
			}
			//disable use only for admin
			const data_send = {
				tai_khoan:{
				   user
				   , mat_khau
				   , hinh_anh
				   , nhanvien
			   }
			   , ho_ten
			   , sdt
			   , email
			};
			const server_get =
			{
				method: "POST",
				headers: {
				  'Content-Type': 'application/json'
				},
				body: JSON.stringify(data_send)
			};
			const send_data = await fetch("/save_tk", server_get);
			const json_get = await send_data.json();
			if(json_get.sign_in)
			{
				window.location.href = origin_http + `/login`;
			}
			else{
				document.getElementById("make_err").innerHTML = json_get.status;
				setTimeout(() => {
					location.reload();
				}, 1200);
			}
		});
	}
}
if(data_path.toString().includes("/login")){
//checking user and password then login
	login();
	async function login(){
		let sign_in_data = document.getElementById("sign_in");
		sign_in_data.addEventListener('click', async () => {
			const user = document.getElementById("user_name").value;
			const pass = document.getElementById("password").value;
			const data_send = {
				user: user
				, mat_khau: pass
			};
			const server_get =
			{
				method: "POST",
				headers: {
				  'Content-Type': 'application/json'
				},
				body: JSON.stringify(data_send)
			};
			const send_data = await fetch("/sign_tk", server_get);
			const data = await send_data.json(); 
			if(data.sgined === true)
			{
				if(data.nv === true){
					window.location.href = origin_http + `/admin/?user=${data.id}&nv=${data.nv}`;
				}else
					window.location.href = origin_http + `/?user=${data.id}`;
			}
			if(data.sgined === false){
				let pass_err = document.getElementById("pass_err");
				pass_err.innerHTML = `${data.status}`;
			}
		});
	} 
}
if(data_path.toString().includes("/sp/detail")){
//save info into an local website for san pham de lam hoa don
    order();	
	async function order(){ 
		let array_order = [];
		if(sessionStorage.getItem("order_sp")){
			let order_array = JSON.parse(sessionStorage.getItem("order_sp"));
			for(let i = 0; i < order_array.length; i++){
				array_order.push(order_array[i]);
			}
		}
		document.getElementById("order_item").addEventListener('click', async () => {
			const number = document.getElementById("show_number").innerHTML;
			const name = document.querySelector(".detail_body #name_item").innerHTML;
			const id = params_get.get("sp");
			const cost = document.querySelector(".detail_body .detail_body_style #cost_item").innerHTML;
			const obj_order ={
				id: id
			   , number: number
			   , name: name
			   , cost: cost
			}
			array_order.push(obj_order);
			sessionStorage.setItem("order_sp", JSON.stringify(array_order));
			let notify = Array.from(document.querySelectorAll(".left_nav ul li.line_side a"));
			for(let i = 0; i< notify.length; i++){
				if(notify[i].getAttribute('href').includes("/shop"))
				{
					// console.log(JSON.parse(sessionStorage.getItem("order_sp")).length);
					if(document.querySelector(".left_nav ul li.line_side a #order_number"))
					{
						const show_number =document.querySelector(".left_nav ul li.line_side a #order_number");
						show_number.innerHTML = JSON.parse(sessionStorage.getItem("order_sp")).length;
						show_number.style.backgroundColor = "rgb(209, 73, 91)";
						show_number.style.color = "white";
						show_number.style.margin = "0 0 0 60px";
						show_number.style.padding = "5px 20px";
						show_number.style.lineHeight = 45+"px";
						show_number.style.borderRadius = 30+"px";
						notify[i].appendChild(show_number);
					}
					else{
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
		});
	}
}
if(data_path.toString().includes("/shop")){
//show shop list on item before hit buy
    order_list();
	async function order_list(){
		if(sessionStorage.getItem("order_sp")){
			let order_array = JSON.parse(sessionStorage.getItem("order_sp"));
			const all_cost_total = document.querySelector(".shop_list .shop_list_foot #total_cost_all");
			const buy_order = document.querySelector(".shop_list .shop_list_foot #shop_order");
			buy_order.style.display = "block";
			let all_cost = 0;
			// console.log(order_array);
			const list_hold = Array.from(document.querySelectorAll(".shop_list .shop_list_body tr"));
			const name = Array.from(document.querySelectorAll(".shop_list .shop_list_body #name"));
			const number = Array.from(document.querySelectorAll(".shop_list .shop_list_body #number"));
			const cost = Array.from(document.querySelectorAll(".shop_list .shop_list_body #cost"));
			const totalcost = Array.from(document.querySelectorAll(".shop_list .shop_list_body #total_cost"));
			for(let i = 0; i < order_array.length; i++){
				// console.log(order_array[i]);
				if(list_hold[i])
				{
					if(list_hold[i].getAttribute("class") === "ordered")
					{
						name[i].innerHTML = order_array[i].name;
						number[i].innerHTML = order_array[i].number;
						cost[i].innerHTML = order_array[i].cost;
						let search_cost = order_array[i].cost;
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
						// console.log((parseFloat(order_array[i].number) * parseFloat(re_join_cost)) + "| showing in totalcost");
						const total =(parseFloat(order_array[i].number) * parseFloat(re_join_cost));
						all_cost = all_cost + total;
						totalcost[i].innerHTML = total +"."+ holding_1;
					}
					else /* if(list_hold[i].getAttribute("class") === "not_order") */{
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
						make_name.innerHTML = order_array[i].name;
						make_number.innerHTML = order_array[i].number;
						make_cost.innerHTML = order_array[i].cost;
						let search_cost = order_array[i].cost;
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
						// console.log(split_cost);
						// console.log(holding_1);
						// console.log(re_join_cost +"| after math");
						const total =(parseFloat(order_array[i].number) * parseFloat(re_join_cost));
						all_cost = all_cost + total;
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
					make_name.innerHTML = order_array[i].name;
					make_number.innerHTML = order_array[i].number;
					make_cost.innerHTML = order_array[i].cost;
					let search_cost = order_array[i].cost;
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
					const total =(parseFloat(order_array[i].number) * parseFloat(re_join_cost));
					all_cost = all_cost + total;
					make_totalcost.innerHTML = total +"."+ holding_1;
					make_cancel.innerHTML = "huy";
					make_cancel_holder.appendChild(make_cancel);
					make_list_hold.append(make_name,make_number,make_cost,make_totalcost,make_cancel_holder);
					make_list_hold.setAttribute("class", "ordered");
					document.querySelector(".shop_list .shop_list_body").appendChild(make_list_hold);
				}
			}
			all_cost_total.innerHTML = all_cost + ".000đ";
		}
		else{
			const list_hold = document.querySelector(".shop_list .shop_list_body .ordered");
			list_hold.setAttribute("class", "not_order");
			const buy_order = document.querySelector(".shop_list .shop_list_foot #shop_order");
			buy_order.style.display = "none";
		}
		let list_hold = document.querySelectorAll(".shop_list .shop_list_body .ordered #cancel");
		for(let i = 0; i < list_hold.length; i++){
			list_hold[i].onclick = () =>{
				let order_array = JSON.parse(sessionStorage.getItem("order_sp"));
				order_array.splice(i , 1);
				sessionStorage.setItem("order_sp", JSON.stringify(order_array));
				location.reload();
			};
		}
	}
}

