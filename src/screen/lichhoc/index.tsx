import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";

function LichHocScreen() {
  return (
    <div>
      <Tabs id="controlled-tabs" className="mb-3" variant="pills">
        <Tab eventKey="list" title>
          <button>Thêm Tin Tức</button>
          <table className="table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Tiêu đề</th>
                <th>Nội dung</th>
                <th>Hình ảnh</th>
                <th>Ngày tạo</th>
                <th>Người tạo</th>
                <th>Chủ đề</th>
              </tr>
            </thead>
          </table>
        </Tab>
      </Tabs>
    </div>
  );
}

export default LichHocScreen;
