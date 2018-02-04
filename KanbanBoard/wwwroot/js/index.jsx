﻿class TaskCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = { data: props.card, isUpdated: false, updateTitle: props.card.title, updateDescription: props.card.description };
        this.onClickDelete = this.onClickDelete.bind(this);
        this.onClickUpdate = this.onClickUpdate.bind(this);
        this.onClickSave = this.onClickSave.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onClickChangeStatus = this.onClickChangeStatus.bind(this);
    }
    onClickDelete(e) {
        this.props.onRemove(this.state.data);
    }
    onClickUpdate(e) {
        this.setState({ isUpdated: true });
    }
    onClickSave(e) {
        this.setState({ isUpdated: false });
        this.props.onUpdate(this.state.data.id, this.state.updateTitle, this.state.updateDescription, this);
    }
    onTitleChange(e) {
        this.setState({ updateTitle: e.target.value });
    }
    onDescriptionChange(e) {
        this.setState({ updateDescription: e.target.value });
    }
    onClickChangeStatus(e) {
        this.props.onChangeStatus(this.state.data, this);
    }
    render() {
        if (this.state.isUpdated) {
            return <div className={this.state.data.state.name}>
                <p><b><input type="text"
                    value={this.state.updateTitle}
                    onChange={this.onTitleChange} /></b></p>
                <p><b><input type="text"
                    value={this.state.updateDescription}
                    onChange={this.onDescriptionChange} /></b></p>
                <p><button onClick={this.onClickDelete}>Delete</button></p>
                <p><button onClick={this.onClickSave}>Save</button></p>
                <p><button onClick={this.onClickChangeStatus}>=></button></p>
            </div>;
        }
        if (this.state.data.state.name == "Done") {
            return <div className={this.state.data.state.name + " col-md-3"}>
                       <p><b>{this.state.data.title}</b></p>
                       <p>{this.state.data.description}</p>
                       <p><button onClick={this.onClickDelete}>Delete</button></p>
                   </div>;

        }
        return <div className={this.state.data.state.name + " col-md-3"}>
            <p><b>{this.state.data.title}</b></p>
            <p>{this.state.data.description}</p>
            <p><button onClick={this.onClickDelete}>Delete</button></p>
            <p><button onClick={this.onClickUpdate}>Update</button></p>
            <p><button onClick={this.onClickChangeStatus}>=></button></p>
        </div>;
    }
}


class TaskDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = { card: [] };

        this.onRemoveCard = this.onRemoveCard.bind(this);
        this.onUpdateCard = this.onUpdateCard.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
    }
    // загрузка данных
    loadData() {
        var xhr = new XMLHttpRequest();
        xhr.open("get", this.props.apiUrl + "/getall", true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            this.setState({ card: data });
        }.bind(this);
        xhr.send();
    }
    componentDidMount() {
        this.loadData();
    }
    // удаление объекта
    onRemoveCard(card) {

        if (card) {
            var url = this.props.apiUrl + "/deletecard/" + card.id;

            var xhr = new XMLHttpRequest();
            xhr.open("delete", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onload = function () {
                if (xhr.status == 200) {
                    this.loadData();
                }
            }.bind(this);
            xhr.send();
        }
    }

    onUpdateCard(id, uTitle, uDescription, context) {
        var data = JSON.stringify({ "id": id, "title": uTitle, "description": uDescription });
        var xhr = new XMLHttpRequest();

        xhr.open("post", this.props.apiUrl + "/updatecard", true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onload = function () {
            if (xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                context.setState({ data: data });
            }
        }.bind(this);
        xhr.send(data);
    }

    onChangeStatus(card, context) {
        //var data = JSON.stringify({ "id": card.id});
        var xhr = new XMLHttpRequest();

        xhr.open("get", this.props.apiUrl + "/changestatuscard/" + card.id, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onload = function () {
            if (xhr.status == 200) {
                var data = JSON.parse(xhr.responseText);
                context.setState({ data: data });
            }
        }.bind(this);
        //xhr.send(data);
        xhr.send();
    }
    //<CardForm onCardSubmit={this.onAddCard} />
    render() {
        var remove = this.onRemoveCard;
        var update = this.onUpdateCard;
        var changeStatus = this.onChangeStatus;
        return <div className="dashboard">
            <h1>Dashboard</h1>
            <a href={this.props.apiUrl + "/create"}>Add task</a>

            <ul>
                <li className="col-md-4">To Do</li>
                <li className="col-md-4">In Progress</li>
                <li className="col-md-4">Done</li>
            </ul>
            <div className="taskList">
                {
                    this.state.card.map(function (card) {

                        return <TaskCard key={card.id} card={card} onRemove={remove} onUpdate={update} onChangeStatus={changeStatus}/>;
                    })
                }
            </div>
        </div>;
    }
}

ReactDOM.render(
    <TaskDashboard apiUrl="/dashboard" />,
    document.getElementById("content")
);