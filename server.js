//calling statment for using
const express = require("express");
const web = express();
const Datastore = require("nedb");

//effect using the express 
web.listen(9000, () => console.log("listen at port 9000"));
web.use(express.static(__dirname  + "/web_ao_mua"));
web.use(express.json({ limit : "2mb"}));

//create data and call data file
const db_tai_khoan = new Datastore("data_base/Data_tk.db");
db_tai_khoan.loadDatabase();
const db_khach_hang = new Datastore("data_base/Data_kh.db");
db_khach_hang.loadDatabase();
const db_san_pham = new Datastore("data_base/Data_sp.db");
db_san_pham.loadDatabase();
const db_nhan_vien = new Datastore("data_base/Data_nv.db");
db_nhan_vien.loadDatabase();
const db_hoa_don = new Datastore("data_base/Data_hd.db");
db_hoa_don.loadDatabase();

/*data trasper*/
web.post("/findAll", (req,res) =>{
	const data = req.body.search;
	db_san_pham.find({ten:  new RegExp(data)}, (err,all) =>{
		if(err)
		{
			console.log(err);
			res.json({
				status: "something wrong happen"
			});
		}
		res.json(all);
	});
});
//lay thong tin tat ca nhan vien
web.get("/list_nv", (req,res) =>{
	new Promise((resolve, reject) =>{
		db_nhan_vien.find({},(err, all) =>{
			if(err)
			{
				console.log(err);
				res.json({
					status: "something wrong happen"
				});
				reject();
			}
			resolve(all);
		});
	}).then((all) =>{
		let array_nv =[];
		for(let item of all)
		{
			db_tai_khoan.findOne({_id: item.id_tk}, (err, tk) =>{
				if(err)
				{	
					console.log(err);
					res.json({
						status: "something wrong happen"
					});
					return;
				}
				array_nv.push({
					ho_ten: item.ho_ten
					, sdt: item.sdt
					, hinh_anh: tk.hinh_anh
				});
			});
		}
		setTimeout(() => {
			res.json(array_nv);
		}, 250);
	});
});
//lay thong tin list hoa don
web.get("/all_hd", (req,res) =>{
	db_hoa_don.find({},(err, all) =>{
		if(err)
		{
			console.log(err);
			res.json({
				status: "something wrong happen"
			});
			return;
		}
		res.json(all);
	});
});
//lay thong tin nv or kh
web.post("/info_tk", (req,res) =>{
	const data = req.body;
	db_khach_hang.findOne({_id: data.id},(err,kh) =>{
		if(err)
		{
			console.log(err);
			res.json({
				status: "something wrong happen"
			});
		}
		if(kh !== null){
			res.json({
				name: kh.ho_ten
			});
		}
	});
	db_nhan_vien.findOne({_id: data.id},(err,nv) =>{
		if(err)
		{
			console.log(err);
			res.json({
				status: "something wrong happen"
			});
			reject();
		}
		if(nv !== null){
			res.json({
				name: nv.ho_ten
			});
		}
	});
});
//lay hinh anh user
web.post("/img_user", (req,res) =>{
	const data = req.body;
	db_tai_khoan.findOne({_id: data.id},(err, tk) =>{
		if(err)
		{
			console.log(err);
			res.end();
			return;
		}
		if(tk === null){
			res.json({
				status: "something wrong happen"
			});
		}else{
			if(tk.nv_check === true){
			   db_nhan_vien.findOne({id_tk: data.id},(err, nv) =>{
				   if(err){
						console.log(err);
						res.end();
						return;
					}
					if(nv !== null){
						res.json({
							hinh_anh: tk.hinh_anh
					 });
					}
					else{
						res.json({
							status : "tai khoan nay ko co"
						});
					}
			   });
			}
			else{
				db_khach_hang.findOne({id_tk: data.id},(err, kh) =>{
					if(err){
						console.log(err);
						res.end();
						return;
					}
					if(kh !== null){
						res.json({
							hinh_anh: tk.hinh_anh
					 });
					}
					else{
						res.json({
							status : "tai khoan nay ko co"
						});
					}
				});
			}
		}
	});
});
//lay thong tin san pham
var all_sp_info = function all_sp(req,res){
	web.get("/all_sp", (req,res) =>{
		db_san_pham.find({},(err, all) =>{
			if(err)
			{
				console.log(err);
				res.json({
					status: "something wrong happen"
				});
				return;
			}
			res.json(all);
			// for(let item of all){
				// console.log("ten ->"+item.ten);
			// }
		});
	});
}
//xoa thong tin san pham
web.post("/delete_sp", (req,res) =>{
	const data = req.body;
	db_san_pham.findOne({_id: data.id}, (err,sp) =>{
		if(err)
		{
			console.log(err);
			res.end();
			return;
		}
		if(sp === null){
			res.json({
				status: "something wrong happen"
			});
		}else{
			db_san_pham.remove({_id: data.id}, {}, (err, num) =>{
				if(err)
				{
					console.log(err);
					res.end();
					return;
				}
				res.json({
					remove: true
				});
			});
		}
	});
});
//xoa thong tin tai khoan
web.post("/delete_tk", (req,res) =>{
	const data = req.body;
	db_tai_khoan.findOne({_id: data.id},(err, tk) =>{
		if(err)
		{
			console.log(err);
			res.end();
			return;
		}
		if(tk === null){
			res.json({
				status: "something wrong happen"
			});
		}else{
			db_tai_khoan.remove({_id: data.id}, {});
			if(tk.nv_check === true){
			   db_nhan_vien.findOne({id_tk: data.id},(err, nv) =>{
				   if(err){
						console.log(err);
						res.end();
						return;
					}
					if(nv !== null){
						db_nhan_vien.remove({id_tk: data.id}, {});
						db_hoa_don.remove({id_buyer: nv.id}, {});
						res.json({
							remove: true
						});
					}else{
						res.json({
							status: "there no info"
						});
					}
			   });
			}
			else{
				db_khach_hang.findOne({id_tk: data.id},(err, kh) =>{
					if(err){
						console.log(err);
						res.end();
						return;
					}
					if(kh !== null){
						db_khach_hang.remove({id_tk: data.id}, {});
						db_hoa_don.remove({id_buyer: kh.id}, {});
						res.json({
							remove: true
						});
					}else{
						res.json({
							status: "there no info"
						});
					}
				});
			}
		}
	});
});
//xoa thong tin hoa don
web.post("/delete_hd", (req,res) =>{
	const data = req.body;
	db_hoa_don.findOne({_id: data.id},(err,hd)=>{
		if(err)
		{
			console.log(err);
			res.end();
			return;
		}
		if(hd === null){
			res.json({
				status: "something wrong happen"
			});
		}else{
			db_hoa_don.remove({_id: data.id}, {}, (err, num) =>{
				if(err)
				{
					console.log(err);
					res.end();
					return;
				}
				res.json({
					remove: true
				});
			});
		}
		
	});
});
//lay thong tin list khach hang
web.get("/list_kh", (req,res) =>{
	new Promise((resolve, reject) =>{
		db_khach_hang.find({},(err, all) =>{
			if(err)
			{
				console.log(err);
				res.json({
					status: "something wrong happen"
				});
				reject();
			}
			resolve(all);
		});
	}).then((all) =>{
		let array_nv =[];
		for(let item of all)
		{
			db_tai_khoan.findOne({_id: item.id_tk}, (err, tk) =>{
				if(err)
				{	
					console.log(err);
					res.json({
						status: "something wrong happen"
					});
					return;
				}
				array_nv.push({
					id: tk._id
					, ho_ten: item.ho_ten
					, sdt: item.sdt
					, user: tk.user
					, check :tk.nv_check
				});
			});
		}
		setTimeout(() => {
			res.json(array_nv);
		}, 250);
	});
});
/*data trasper end*/
/*route website send file*/
//de the hien tat ca san pham
web.get("/", (req,res,next) =>{
    res.sendFile( __dirname + "/web_ao_mua/html" + "/index_main.html" );
	next();
}, all_sp_info);
//de tao thong tin tai khoan
web.get("/register*", (req,res,next) =>{
    res.sendFile( __dirname + "/web_ao_mua/html" + "/index_register.html" );
	next();
}
// save tai khoan va (khach hang hoac nhan vien)
, (req,res) =>{
	web.post("/save_tk",(req , res) => {
		const data = req.body;
		function tk_data(){
			return new Promise((resolve, reject) => {
				let check = null;
				db_tai_khoan.findOne({user: data.tai_khoan.user}, (err, tk) => {
					if(err)
					{
						reject({
							status: "da xay ra loi trong luc lam"
							,   err: err
						});
					}
					if(tk ===  null)
					{
						const json_tk = {
							user: data.tai_khoan.user
							,   mat_khau: data.tai_khoan.mat_khau
							,   nv_check: data.tai_khoan.nhanvien
							,   hinh_anh: data.tai_khoan.hinh_anh
						};
						db_tai_khoan.insert(json_tk);
						resolve();
					}else
					{
						reject({
							status : "tai khoan da ton tai"
							,   user: "da co user nay roi"
						});
					}
				});
			});
		}
		tk_data().then(() => {
			if(data.tai_khoan.nhanvien === true)
			{
				db_nhan_vien.findOne({email: data.email},(err , nv) =>
				{
					if(err)
					{
						return;
					}
					if(nv === null)
					{
						db_tai_khoan.findOne({user: data.tai_khoan.user}, (err, up_tk) =>{
							if(err)
							{
								return;
							}
							const json_data = {
									ho_ten: data.ho_ten
									,   sdt: data.sdt
									,   email: data.email
									,   id_tk: up_tk._id
								};
							db_nhan_vien.insert(json_data);
							res.json({
								sign_in: true
							});
						});
					}
					else{
						res.json({
							status : "da co email ton tai"
							,   email: "thay doi email khac"
						});
					}
				});
			}
			else
			{
				db_khach_hang.findOne({email: data.email},(err , kh) =>{
					if(err)
					{
						return;
					}
					if(kh === null)
					{
						db_tai_khoan.findOne({user: data.tai_khoan.user}, (err, up_tk) =>{
							if(err){
								return;
							}
							const json_data = {
									ho_ten: data.ho_ten
									,   sdt: data.sdt
									,   email: data.email
									,   id_tk: up_tk._id
								};
							db_khach_hang.insert(json_data); 
							res.json({
								sign_in: true
							});
						});
					}
					else{
						res.json({
							status : "email nay da ton tai"
							,   email: "thay doi email khac"
						});
					}
				});
			}
		}).catch((send_web)=>{
			res.json(send_web);
		});
	});
});
//de dien thong tin dang nhap
web.get("/login*", (req,res,next) =>{
    res.sendFile( __dirname + "/web_ao_mua/html" + "/index_dangnhap.html" );
	next();
}
// dang nhap tai khoan
, (req,res) =>{
	web.post('/sign_tk', (req , res) =>{
		const data = req.body;
		function tk_get(){
			return new Promise((resolve, reject) => {
				let check = null;
				db_tai_khoan.findOne({user: data.user}, (err, tk) => {
					if(err)
					{
						reject({
							status: "da xay ra loi trong luc lam"
							,   err: err
						});
					}
					if(tk ===  null)
					{
						reject({
							status : "tai khoan nay ko ton tai"
							,   sgined: false
						});
					}else
					{
						if(tk.mat_khau === data.mat_khau){
							resolve({
								sgined: true
								,   id: tk._id
								,	nv: tk.nv_check
							});
						}
						else{
							reject({
							status : "mat khau bi sai"
							,   sgined: false
							});
						}
					}
				});
			});
		}
		tk_get().then((data) => {
			res.json(data);
		}).catch((err) =>{
			res.json(err);
		});
	});
});
//thay doi thong tin tai khoan
web.get("/change_user", (req,res,next) =>{//done
	res.sendFile( __dirname + "/web_ao_mua/html" + "/index_register.html");
	next();
}
//truyen thong tin tai khoan
, (req,res,next) =>{ //done
	web.post("/info_user", (req,res) =>{
		const data = req.body;
		// console.log(data);
		db_tai_khoan.findOne({_id: data.id},(err, tk) =>{
			if(err)
			{
				console.log(err);
				res.end();
				return;
			}
			if(tk === null){
				res.json({
					status: "something wrong happen"
				});
			}else{
				if(tk.nv_check === true){
				   db_nhan_vien.findOne({id_tk: data.id},(err, nv) =>{
					   if(err){
							console.log(err);
							res.end();
							return;
						}
						if(nv !== null){
							res.json({
								hinh_anh: tk.hinh_anh
								, user: tk.user
								, ten: nv.ho_ten
								, email: nv.email
								, sdt: nv.sdt
							});
						}else{
							res.json({
								status : "tai khoan nay ko co"
							});
						}
				   });
				}
				else{
					db_khach_hang.findOne({id_tk: data.id},(err, kh) =>{
						if(err){
							console.log(err);
							res.end();
							return;
						}
						if(kh !== null){
							res.json({
								hinh_anh: tk.hinh_anh
								, user: tk.user
								, ten: kh.ho_ten
								, email: kh.email
								, sdt: kh.sdt
							});
						}else{
							res.json({
								status : "tai khoan nay ko co"
							});
						}
					});
				}
			}
		});
	});
	next();
}
//thay doi thong tin tai khoan
, (req,res) =>{ //done
	web.post("/reupload_tk", (req,res) =>{
		const data = req.body;
		db_tai_khoan.findOne({_id: data.id},(err, tk) =>{
			if(err)
			{
				console.log(err);
				res.end();
				return;
			}
			if(tk === null){
				res.json({
					status: "something wrong happen"
				});
			}else{
				db_tai_khoan.update({_id: data.id}, {$set:{hinh_anh: data.tai_khoan.hinh_anh}});
				if(tk.nv_check === true){
				   db_nhan_vien.findOne({id_tk: data.id},(err, nv) =>{
					   if(err){
							console.log(err);
							res.end();
							return;
						}
						if(nv !== null){
							db_nhan_vien.update({id_tk: data.id}, {$set:{ho_ten: data.ho_ten, sdt: data.sdt, email: data.email}});
							res.json({
								changed: true
							});
						}else{
							res.json({
								status: "something wrong happen"
							});
						}
				   });
				}
				else{
					db_khach_hang.findOne({id_tk: data.id},(err, kh) =>{
						if(err){
							console.log(err);
							res.end();
							return;
						}
						if(kh !== null){
							db_khach_hang.update({id_tk: data.id}, {$set:{ho_ten: data.ho_ten, sdt: data.sdt, email: data.email}});
							res.json({
								changed: true
							});
						}else{
							res.json({
								status: "something wrong happen"
							});
						}
					});
				}
			}
		});
	});
});
//de the hien thong tin
web.get("/admin", (req,res) =>{ //done
    res.sendFile( __dirname + "/web_ao_mua/html" + "/admin_main.html" );
});
web.get("/admin/sanpham", (req,res,next) =>{ //done
    res.sendFile( __dirname + "/web_ao_mua/html" + "/admin_sanpham.html" );
	next();
}
//the hien thong tin hoa don
, all_sp_info);
//de tao thong tin san pham
web.get("/admin/create_sp", (req,res,next) =>{
    res.sendFile( __dirname + "/web_ao_mua/html" + "/admin_register.html" );
	next();
}
// save thong tin san pham
, (req,res) =>{
	web.post("/save_sp", (req,res) =>{
		const data = req.body;
		db_san_pham.findOne({ten: data.ten} ,(err, sp) => {
			if(err)
			{
				res.json({
					status: "da xay ra loi trong luc lam"
					,   err: err
				});
			}
			if(sp ===  null)
			{
				db_san_pham.insert({
					ten: data.ten
					,   cost: data.cost
					,   kind: data.kind
					,   info: data.info
					,   detail: data.detail
					,   hinh_anh: data.hinh_anh
				});
				res.json({
					created: true
				});
			}else
			{
				res.json({
					status : "san pham da ton tai"
					,   had_sp: sp.ten
					,	id: sp._id
				});
			}
		});
	});
});
//thay doi thong tin san pham
web.get("/admin/change_sp", (req,res,next) =>{//not done
	res.sendFile( __dirname + "/web_ao_mua/html" + "/admin_register.html");
	next();
}
//truyen thong tin 1 san pham
,(req,res,next) =>{
	web.post("/info_sp", (req,res) =>{
		const data = req.body;
		db_san_pham.findOne({_id: data.id},(err, sp) =>{
			if(err)
			{
				console.log(err);
				res.end();
				return;
			}
			if(sp === null){
				res.json({
					status: "something wrong happen"
				});
			}else{
				res.json({
				ten: sp.ten
				, cost: sp.cost
				, kind: sp.kind
				, info: sp.info
				, detail: sp.detail
				, hinh_anh: sp.hinh_anh
				});
		   }
		});
	});
	next();
}
//thay doi thong tin san pham
, (req,res) =>{ //not done
	web.post("/reupload_sp", (req,res) =>{
		const data = req.body;
		// console.log(data);
		db_san_pham.findOne({_id: data.id},(err, sp) =>{
			if(err){
				console.log(err);
				res.end();
				return;
			}
			if(sp === null){
				res.json({
					status: "something wrong happen"
				});
			}else{
					db_san_pham.update({_id: data.id}
					, {$set:{ten: data.ten, cost: data.cost, kind: data.kind, info: data.info, detail: data.detail, hinh_anh: data.hinh_anh}});
					res.json({
						changed: true
					});
			}
		});
	});
});

//de the hien tat ca loai san pham
web.get("/allkind", (req,res,next) =>{
    res.sendFile( __dirname + "/web_ao_mua/html" + "/index_allkind.html" );
	next();
}
//hien het thong tin trong data san pham
, all_sp_info);
//de the hien thong tin tung loai san pham
web.get("/allkind/:kind", (req,res,next) =>{ //done
	switch(req.params.kind)
	{
		case "canh_doi":{
			res.sendFile( __dirname + "/web_ao_mua/html" + "/index_canhdoi.html" );
			break;
		}
		case "bo":{
			res.sendFile( __dirname + "/web_ao_mua/html" + "/index_bo.html" );
			break;
		}
		case "tre_em":{
			res.sendFile( __dirname + "/web_ao_mua/html" + "/index_tre.html" );
			break;
		}
		case "badesi":{
			res.sendFile( __dirname + "/web_ao_mua/html" + "/index_badesi.html" );
			break;
		}
		case "may_giac":{
			res.sendFile( __dirname + "/web_ao_mua/html" + "/index_giac.html" );
			break;
		}
		case "phu_xe":{
			res.sendFile( __dirname + "/web_ao_mua/html" + "/index_xe.html" );
			break;
		}
	}
	next();
}
//the hien 1 danh sach cung 1 loai sp
,() =>{
	web.post("/kind_list", (req,res) =>{
		const data = req.body;
		db_san_pham.find({kind: data.search},(err, kind) =>{
			if(err)
			{
				console.log(err);
				res.json({
					status: "something wrong happen"
				});
				return;
			}
			res.json(kind);
			// for(let item of kind){
				// console.log("ten ->"+item.ten);
			// }
		});
	});
});
//de hien thong tin san pham chi tiet va co the cho vao gio
web.get("/sp/detail*", (req,res,next) =>{
	res.sendFile( __dirname + "/web_ao_mua/html" + "/index_detail.html" );
	next();
}
//the hien thong tin chi tiet ve 1 san pham
, () =>{
	web.post("/detail_sp", (req,res) =>{
		const data = req.body;
		db_san_pham.findOne({_id: data.id} ,(err, sp) => {
			if(err)
			{
				res.json({
					status: "da xay ra loi trong luc lam"
					,   err: err
				});
			}
			if(sp ===  null)
			{
				res.json({
					status:"san pham chua ton tai"
					,created: false
				});
			}else
			{
				res.json({
					ten: sp.ten
					,   cost: sp.cost
					,   kind: sp.kind
					,   info: sp.info
					,   detail: sp.detail
					,   hinh_anh: sp.hinh_anh
				});
			}
		});
	});
});
//de hien danh sach san pham trong gio
web.get("/shop*", (req,res,next) =>{ //done
	res.sendFile( __dirname + "/web_ao_mua/html" + "/index_shoplist.html" );
	next();
}
//save thong tin hoa don
, () =>{
	web.post("/save_hd", (req,res) =>{
		const data = req.body;
		const date_order =  Date.now();
		db_tai_khoan.findOne({_id: data.id},(err, tk) =>{
			if(err)
			{
				console.log(err);
				res.end();
				return;
			}
			if(tk === null){
				res.json({
					status: "something wrong happen"
				});
			}else{
				if(tk.nv_check === true){
				   db_nhan_vien.findOne({id_tk: data.id},(err, nv) =>{
					   if(err){
							console.log(err);
							res.end();
							return;
						}
						if(nv !== null){
							db_hoa_don.insert({
								date_order: date_order
								,   order_list: data.order_list
								,   money: data.money
								,	id_buyer: nv._id
							});
							res.json({
								created: true
								, status: "hoa don duoc tao"
							});
						}else{
							res.json({
								status : "tai khoan nay ko co"
							});
						}
				   });
				}
				else{
					db_khach_hang.findOne({id_tk: data.id},(err, kh) =>{
						if(err){
							console.log(err);
							res.end();
							return;
						}
						if(kh !== null){
							db_hoa_don.insert({
								date_order: date_order
								,   order_list: data.order_list
								,   money: data.money
								,	id_buyer: kh._id
							});
							res.json({
								created: true
								, status: "hoa don duoc tao"
							});
						}else{
							res.json({
								status : "tai khoan nay ko co"
							});
						}
					});
				}
			}
		});
	});
});

web.get("/admin/taikhoan", (req,res) =>{ //done
	res.sendFile( __dirname + "/web_ao_mua/html" + "/admin_taikhoan.html" );
});

web.get("/admin/hoadon", (req,res) =>{ //done
	res.sendFile( __dirname + "/web_ao_mua/html" + "/admin_hoadon.html" );
});

web.get("/admin/change_kh", (req,res,next) =>{
	res.sendFile( __dirname + "/web_ao_mua/html" + "/admin_kh_detail.html" );
	next();
}
,(req,res,next) =>{
	web.post("/info_user", (req,res) =>{
		const data = req.body;
		// console.log(data);
		db_tai_khoan.findOne({_id: data.id},(err, tk) =>{
			if(err)
			{
				console.log(err);
				res.end();
				return;
			}
			if(tk === null){
				res.json({
					status: "something wrong happen"
				});
			}else{
				if(tk.nv_check === true){
				   db_nhan_vien.findOne({id_tk: data.id},(err, nv) =>{
					   if(err){
							console.log(err);
							res.end();
							return;
						}
						if(nv !== null){
							res.json({
								hinh_anh: tk.hinh_anh
								, user: tk.user
								, ten: nv.ho_ten
								, email: nv.email
								, sdt: nv.sdt
								, pass: tk.mat_khau
							});
						}else{
							res.json({
								status : "tai khoan nay ko co"
							});
						}
				   });
				}
				else{
					db_khach_hang.findOne({id_tk: data.id},(err, kh) =>{
						if(err){
							console.log(err);
							res.end();
							return;
						}
						if(kh !== null){
							res.json({
								hinh_anh: tk.hinh_anh
								, user: tk.user
								, ten: kh.ho_ten
								, email: kh.email
								, sdt: kh.sdt
								, pass: tk.mat_khau
							});
						}else{
							res.json({
								status : "tai khoan nay ko co"
							});
						}
					});
				}
			}
		});
	});
	next();
}
,() =>{
	web.post("/reupload_tk", (req,res) =>{
		const data = req.body;
		db_tai_khoan.findOne({_id: data.id},(err, tk) =>{
			if(err)
			{
				console.log(err);
				res.end();
				return;
			}
			if(tk === null){
				res.json({
					status: "something wrong happen"
				});
			}else{
				db_tai_khoan.update({_id: data.id}, {$set:{hinh_anh: data.tai_khoan.hinh_anh, user: data.tai_khoan.user, mat_khau: data.tai_khoan.pass}});
				if(tk.nv_check === true){
				   db_nhan_vien.findOne({id_tk: data.id},(err, nv) =>{
					   if(err){
							console.log(err);
							res.end();
							return;
						}
						if(nv !== null){
							db_nhan_vien.update({id_tk: data.id}, {$set:{ho_ten: data.ho_ten, sdt: data.sdt, email: data.email}});
							res.json({
								changed: true
							});
						}else{
							res.json({
								status: "something wrong happen"
							});
						}
				   });
				}
				else{
					db_khach_hang.findOne({id_tk: data.id},(err, kh) =>{
						if(err){
							console.log(err);
							res.end();
							return;
						}
						if(kh !== null){
							db_khach_hang.update({id_tk: data.id}, {$set:{ho_ten: data.ho_ten, sdt: data.sdt, email: data.email}});
							res.json({
								changed: true
							});
						}else{
							res.json({
								status: "something wrong happen"
							});
						}
					});
				}
			}
		});
	});
});

web.get("/admin/change_hd", (req,res,next) =>{
	res.sendFile( __dirname + "/web_ao_mua/html" + "/admin_hd_detail.html" );
	next();
}
,(req,res/* ,next */) =>{
	web.post("/info_hd", (req,res) =>{
		const data = req.body;
		db_hoa_don.findOne({_id: data.id},(err, hd) =>{
			if(err)
			{
				console.log(err);
				res.end();
				return;
			}
			if(hd === null){
				res.json({
					status: "something wrong happen"
				});
			}else{
				db_khach_hang.findOne({_id: hd.id_buyer},(err, kh) =>{
					if(err){
						console.log(err);
						res.end();
						return;
					}
					if(kh !== null){
						res.json({
							date: hd.date_order
							, list: hd.order_list
							, money: hd.money
							, name: kh.ho_ten
						});
					}else{
						res.json({
							status : "tai khoan nay ko co"
						});
					}
				});
			}
		});
	});
	/* next(); */
}
/* ,() =>{
	web.post("/reupload_hd" , (req,res) =>{
		
		
	});
} */);

web.get("/searching", (req,res) =>{
	res.sendFile( __dirname + "/web_ao_mua/html" + "/index_search.html" );
});
/*route website end*/

